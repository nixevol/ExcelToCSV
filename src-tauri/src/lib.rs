use calamine::{open_workbook_auto, Reader, Data};
use csv::WriterBuilder;
use encoding_rs::GBK;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Write;
use std::path::Path;
use tauri::{AppHandle, Emitter};
use chrono::Local;

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
    message: String,
}

#[derive(Deserialize)]
struct ConvertConfig {
    files: Vec<String>,
    output_dir: Option<String>,
    naming_rule: String, // "excel-sheet-time", "sheet-time", "excel-sheet"
    encoding: String,    // "GBK", "UTF-8"
    sheet_filters: Vec<String>,
}

fn emit_log(app: &AppHandle, level: &str, message: &str) {
    let _ = app.emit("convert-log", LogPayload {
        level: level.to_string(),
        message: message.to_string(),
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
async fn convert_excel_to_csv(app: AppHandle, config: ConvertConfig) -> Result<(), String> {
    let total_files = config.files.len();
    emit_log(&app, "info", &format!("========== 开始处理，共 {} 个文件 ==========", total_files));

    for (file_idx, file_path_str) in config.files.iter().enumerate() {
        let file_path = Path::new(file_path_str);
        let file_name = file_path.file_stem().unwrap_or_default().to_string_lossy().to_string();
        
        emit_log(&app, "info", &format!("\n---> 开始读取文件 [{}/{}] : {}", file_idx + 1, total_files, file_name));
        
        let mut workbook = match open_workbook_auto(file_path) {
            Ok(wb) => wb,
            Err(e) => {
                emit_log(&app, "error", &format!("无法打开文件 {}: {}", file_name, e));
                continue;
            }
        };

        let sheets = workbook.sheet_names().to_owned();
        let total_sheets = sheets.len();
        emit_log(&app, "info", &format!("成功读取到 {} 个 Sheet", total_sheets));
        
        for (sheet_idx, sheet_name) in sheets.iter().enumerate() {
            emit_progress(&app, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "parsing");
            
            // Sheet Filter Logic
            let mut skip = false;
            for filter in &config.sheet_filters {
                if !filter.trim().is_empty() && sheet_name.contains(filter.trim()) {
                    skip = true;
                    break;
                }
            }
            if skip {
                emit_log(&app, "warn", &format!("跳过 Sheet [{}/{}] : {} (匹配关键字排除规则)", sheet_idx + 1, total_sheets, sheet_name));
                emit_progress(&app, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "skipped");
                continue;
            }

            emit_log(&app, "info", &format!("正在转换 Sheet [{}/{}] : {}", sheet_idx + 1, total_sheets, sheet_name));
            emit_progress(&app, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "converting");

            let range = match workbook.worksheet_range(sheet_name) {
                Ok(r) => r,
                Err(e) => {
                    emit_log(&app, "error", &format!("读取失败 {}: {}", sheet_name, e));
                    continue;
                }
            };

            let out_dir = config.output_dir.clone().unwrap_or_else(|| {
                file_path.parent().unwrap_or_else(|| Path::new("")).to_string_lossy().to_string()
            });
            let out_dir_path = Path::new(&out_dir);
            if !out_dir_path.exists() {
                let _ = std::fs::create_dir_all(out_dir_path);
            }

            let timestamp = Local::now().format("%Y%m%d_%H%M%S").to_string();
            let out_file_name = match config.naming_rule.as_str() {
                "sheet-time" => format!("{}_{}.csv", sheet_name, timestamp),
                "excel-sheet" => format!("{}-{}.csv", file_name, sheet_name),
                _ => format!("{}-{}_{}.csv", file_name, sheet_name, timestamp),
            };
            
            let out_file_path = out_dir_path.join(out_file_name);
            
            let file = match File::create(&out_file_path) {
                Ok(f) => f,
                Err(e) => {
                    emit_log(&app, "error", &format!("创建输出文件失败: {}", e));
                    continue;
                }
            };

            let mut wtr = WriterBuilder::new().from_writer(vec![]);

            for row in range.rows() {
                let row_str: Vec<String> = row.iter().map(|cell| {
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
                }).collect();
                let _ = wtr.write_record(&row_str);
            }

            let csv_bytes = wtr.into_inner().unwrap_or_default();
            let mut final_file = file;

            if config.encoding == "GBK" {
                let lossy_str = String::from_utf8_lossy(&csv_bytes);
                let (cow, _, _) = GBK.encode(&lossy_str);
                let _ = final_file.write_all(&cow);
            } else {
                let _ = final_file.write_all(&csv_bytes);
            }

            emit_log(&app, "info", &format!("  -> 成功保存: {}", out_file_path.file_name().unwrap().to_string_lossy()));
            emit_progress(&app, file_idx, total_files, sheet_idx + 1, total_sheets, &file_name, sheet_name, "done");
        }
    }

    emit_log(&app, "info", "========== ✅ 所有任务处理完成！ ==========");
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![convert_excel_to_csv])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
