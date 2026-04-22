export default {
  languageLabel: '繁體中文',
  theme: {
    dark: '深色',
    light: '淺色'
  },
  filter: {
    title: '設置排除關鍵字',
    modalTitle: 'Sheet 排除規則設置',
    description: '當 Sheet 名稱包含以下任意關鍵字時，將跳過不轉換。輸入關鍵字後按 Enter 增加。',
    placeholder: '例如: 彙總',
    clearAll: '清空全部',
    done: '完成'
  },
  tooltip: {
    importFiles: '匯入 Excel 檔案',
    clearList: '清空列表'
  },
  table: {
    fileName: '檔案名稱',
    type: '類型',
    size: '大小',
    path: '路徑',
    actions: '操作',
    delete: '刪除',
    emptyHint: '請拖入需轉換檔案 / 點擊右上角 {icon} 增加檔案'
  },
  config: {
    namingRule: '命名規則',
    encoding: '檔案編碼',
    threads: '執行緒數',
    outputDir: '輸出目錄',
    outputPlaceholder: '預設儲存至原目錄',
    select: '選擇'
  },
  naming: {
    excelSheetTime: 'Excel名-Sheet名_時間戳.csv',
    sheetTime: 'Sheet名_時間戳.csv',
    excelSheet: 'Excel名-Sheet名.csv'
  },
  button: {
    start: '開始轉換',
    stop: '停止轉換'
  },
  status: {
    title: '任務狀態',
    totalProgress: '總進度',
    files: '檔案',
    currentProcessing: '當前處理：',
    fatalError: '致命錯誤'
  },
  about: {
    title: '關於',
    description: 'Excel 轉 CSV 桌面工具',
    developer: '開發者：Nixevol',
    github: '造訪 GitHub 主頁'
  },
  log: {
    START_PROCESSING: '========== 開始處理，共 {total} 個檔案 ==========',
    CONVERSION_CANCELLED: '轉換被用戶手動取消！',
    READING_FILE: '\n---> 開始讀取檔案 [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: '無法打開檔案 {file}: {error}',
    READ_SHEETS_SUCCESS: '成功讀取到 {count} 個 Sheet',
    SKIP_SHEET: '跳過 Sheet [{current}/{total}] : {sheet} (匹配關鍵字排除規則)',
    CONVERTING_SHEET: '正在轉換 Sheet [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: '讀取失敗 {sheet}: {error}',
    CREATE_OUTPUT_FAILED: '創建輸出檔案失敗: {error}',
    SAVE_SUCCESS: '  -> 成功儲存: {file}',
    ALL_TASKS_COMPLETED: '========== ✅ 所有任務處理完成！ =========='
  }
}
