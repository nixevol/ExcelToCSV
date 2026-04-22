use calamine::{open_workbook_auto, Reader, Data};
use csv::WriterBuilder;
use encoding_rs::GBK;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::fs::File;
use std::io::{Write, BufWriter};
use std::path::Path;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Emitter, State};
use chrono::Local;

struct CancelFlag(AtomicBool);

/// UTF-8 to GBK streaming encoder
struct GbkEncoder<W: Write> {
    inner: W,
    pending: Vec<u8>,
}

impl<W: Write> GbkEncoder<W> {
    fn new(inner: W) -> Self {
        Self { inner, pending: Vec::new() }
    }
}

impl<W: Write> Write for GbkEncoder<W> {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.pending.extend_from_slice(buf);
        match std::str::from_utf8(&self.pending) {
            Ok(s) => {
                let (encoded, _, _) = GBK.encode(s);
                self.inner.write_all(&encoded)?;
                self.pending.clear();
            }
            Err(e) => {
                let valid_up_to = e.valid_up_to();
                if valid_up_to > 0 {
                    let s = unsafe { std::str::from_utf8_unchecked(&self.pending[..valid_up_to]) };
                    let (encoded, _, _) = GBK.encode(s);
                    self.inner.write_all(&encoded)?;
                    let remaining = self.pending[valid_up_to..].to_vec();
                    self.pending = remaining;
                }
            }
        }
        Ok(buf.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        if !self.pending.is_empty() {
            let s = String::from_utf8_lossy(&self.pending);
            let (encoded, _, _) = GBK.encode(&s);
            self.inner.write_all(&encoded)?;
            self.pending.clear();
        }
        self.inner.flush()
    }
}

fn cell_to_string(cell: &Data) -> String {
    match cell {
        Data::Empty => String::new(),
        Data::String(s) => s.to_string(),
        Data::Float(f) => f.to_string(),
        Data::Int(i) => i.to_string(),
        Data::Bool(b) => b.to_string(),
        Data::DateTime(d) => d.to_string(),
        Data::DateTimeIso(d) => d.to_string(),
        Data::DurationIso(d) => d.to_string(),
        Data::Error(e) => format!("ERROR: {:?}", e),
    }
}

fn write_sheet_to_csv<W: Write>(range: &calamine::Range<Data>, writer: W, row_buf: &mut Vec<String>) {
    let mut wtr = WriterBuilder::new().from_writer(writer);
    for row in range.rows() {
        row_buf.clear();
        for cell in row.iter() {
            row_buf.push(cell_to_string(cell));
        }
        let _ = wtr.write_record(&*row_buf);
    }
    let _ = wtr.flush();
}

#[derive(Serialize)]
struct FileInfo {
    path: String,
    name: String,
    extension: String,
    size_bytes: u64,
}

#[tauri::command]
fn get_file_info(paths: Vec<String>) -> Vec<FileInfo> {
    paths.into_iter().map(|path| {
        let p = Path::new(&path);
        let name = p.file_name().unwrap_or_default().to_string_lossy().to_string();
        let extension = p.extension().unwrap_or_default().to_string_lossy().to_string();
        let size_bytes = std::fs::metadata(&path).map(|m| m.len()).unwrap_or(0);
        FileInfo { path, name, extension, size_bytes }
    }).collect()
}

#[derive(Clone, Serialize)]
struct ProgressPayload {
    file_idx: usize,
    total_files: usize,
    sheet_idx: usize,
    total_sheets: usize,
    file_name: String,
    sheet_name: String,
    status: String, // "parsing", "converting", "done", "skipped"
}

#[derive(Clone, Serialize)]
struct LogPayload {
    level: String, // "info", "warn", "error"
    code: String,
    args: Value,
}

#[derive(Deserialize)]
struct ConvertConfig {
    files: Vec<String>,
    output_dir: Option<String>,
    naming_rule: String,
    encoding: String,
    sheet_filters: Vec<String>,
    max_threads: usize,
}

fn emit_log(app: &AppHandle, level: &str, code: &str, args: Value) {
    let _ = app.emit("convert-log", LogPayload {
        level: level.to_string(),
        code: code.to_string(),
        args,
    });
}

fn emit_progress(
    app: &AppHandle,
    file_idx: usize,
    total_files: usize,
    sheet_idx: usize,
    total_sheets: usize,
    file_name: &str,
    sheet_name: &str,
    status: &str,
) {
    let _ = app.emit("convert-progress", ProgressPayload {
        file_idx,
        total_files,
        sheet_idx,
        total_sheets,
        file_name: file_name.to_string(),
        sheet_name: sheet_name.to_string(),
        status: status.to_string(),
    });
}

#[tauri::command]
fn cancel_conversion(cancel_flag: State<'_, CancelFlag>) {
    cancel_flag.0.store(true, Ordering::SeqCst);
}

#[tauri::command]
async fn convert_excel_to_csv(app: AppHandle, config: ConvertConfig, cancel_flag: State<'_, CancelFlag>) -> Result<(), String> {
    cancel_flag.0.store(false, Ordering::SeqCst);
    let total_files = config.files.len();
    emit_log(&app, "info", "START_PROCESSING", json!({ "total": total_files }));

    let num_threads = config.max_threads.max(1).min(total_files.max(1));
    let pool = rayon::ThreadPoolBuilder::new()
        .num_threads(num_threads)
        .build()
        .map_err(|e| e.to_string())?;

    let cancel = &cancel_flag.0;
    let app_ref = &app;
    let config_ref = &config;

    pool.install(|| {
        config_ref.files.par_iter().enumerate().for_each(|(file_idx, file_path_str)| {
            if cancel.load(Ordering::SeqCst) {
                return;
            }

            let file_path = Path::new(file_path_str);
            let file_name = file_path.file_stem().unwrap_or_default().to_string_lossy().to_string();

            emit_log(app_ref, "info", "READING_FILE", json!({ "current": file_idx + 1, "total": total_files, "file": file_name }));

            let mut workbook = match open_workbook_auto(file_path) {
                Ok(wb) => wb,
                Err(e) => {
                    emit_log(app_ref, "error", "OPEN_FILE_FAILED", json!({ "file": file_name, "error": e.to_string() }));
                    return;
                }
            };

            let sheets = workbook.sheet_names().to_owned();
            let total_sheets = sheets.len();
            emit_log(app_ref, "info", "READ_SHEETS_SUCCESS", json!({ "count": total_sheets }));
            let mut row_buf: Vec<String> = Vec::new();

            for (sheet_idx, sheet_name) in sheets.iter().enumerate() {
                if cancel.load(Ordering::SeqCst) {
                    return;
                }

                emit_progress(app_ref, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "parsing");

                let mut skip = false;
                for filter in &config_ref.sheet_filters {
                    if !filter.trim().is_empty() && sheet_name.contains(filter.trim()) {
                        skip = true;
                        break;
                    }
                }
                if skip {
                    emit_log(app_ref, "warn", "SKIP_SHEET", json!({ "current": sheet_idx + 1, "total": total_sheets, "sheet": sheet_name }));
                    emit_progress(app_ref, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "skipped");
                    continue;
                }

                emit_log(app_ref, "info", "CONVERTING_SHEET", json!({ "current": sheet_idx + 1, "total": total_sheets, "sheet": sheet_name }));
                emit_progress(app_ref, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "converting");

                let range = match workbook.worksheet_range(sheet_name) {
                    Ok(r) => r,
                    Err(e) => {
                        emit_log(app_ref, "error", "READ_SHEET_FAILED", json!({ "sheet": sheet_name, "error": e.to_string() }));
                        continue;
                    }
                };

                let out_dir = config_ref.output_dir.clone().unwrap_or_else(|| {
                    file_path.parent().unwrap_or_else(|| Path::new("")).to_string_lossy().to_string()
                });
                let out_dir_path = Path::new(&out_dir);
                if !out_dir_path.exists() {
                    let _ = std::fs::create_dir_all(out_dir_path);
                }

                let timestamp = Local::now().format("%Y%m%d_%H%M%S").to_string();
                let out_file_name = match config_ref.naming_rule.as_str() {
                    "sheet-time" => format!("{}_{}.csv", sheet_name, timestamp),
                    "excel-sheet" => format!("{}-{}.csv", file_name, sheet_name),
                    _ => format!("{}-{}_{}.csv", file_name, sheet_name, timestamp),
                };

                let out_file_path = out_dir_path.join(out_file_name);

                let file = match File::create(&out_file_path) {
                    Ok(f) => f,
                    Err(e) => {
                        emit_log(app_ref, "error", "CREATE_OUTPUT_FAILED", json!({ "error": e.to_string() }));
                        continue;
                    }
                };

                let buf_writer = BufWriter::with_capacity(65536, file);
                if config_ref.encoding == "GBK" {
                    write_sheet_to_csv(&range, GbkEncoder::new(buf_writer), &mut row_buf);
                } else {
                    write_sheet_to_csv(&range, buf_writer, &mut row_buf);
                }

                emit_log(app_ref, "info", "SAVE_SUCCESS", json!({ "file": out_file_path.file_name().unwrap().to_string_lossy() }));
                emit_progress(app_ref, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "done");
            }
        });
    });

    emit_log(&app, "info", "ALL_TASKS_COMPLETED", json!({}));
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(CancelFlag(AtomicBool::new(false)))
        .invoke_handler(tauri::generate_handler![convert_excel_to_csv, get_file_info, cancel_conversion])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
