export default {
  languageLabel: 'English',
  theme: {
    dark: 'Dark',
    light: 'Light'
  },
  filter: {
    title: 'Exclusion Rules',
    modalTitle: 'Sheet Exclusion Rules',
    description: 'Sheets whose name contains any of the following keywords will be skipped. Press Enter to add a keyword.',
    placeholder: 'e.g. Summary',
    clearAll: 'Clear All',
    done: 'Done'
  },
  tooltip: {
    importFiles: 'Import Excel Files',
    clearList: 'Clear List'
  },
  table: {
    fileName: 'File Name',
    type: 'Type',
    size: 'Size',
    path: 'Path',
    actions: 'Actions',
    delete: 'Delete',
    emptyHint: 'Drag files here or click {icon} to add'
  },
  config: {
    namingRule: 'Naming Rule',
    encoding: 'Encoding',
    threads: 'Threads',
    outputDir: 'Output Dir',
    outputPlaceholder: 'Default: same as source',
    select: 'Select'
  },
  naming: {
    excelSheetTime: 'Excel-Sheet_Timestamp.csv',
    sheetTime: 'Sheet_Timestamp.csv',
    excelSheet: 'Excel-Sheet.csv'
  },
  button: {
    start: 'Start',
    stop: 'Stop'
  },
  status: {
    title: 'Task Status',
    totalProgress: 'Total Progress',
    files: 'Files',
    currentProcessing: 'Processing: ',
    fatalError: 'Fatal Error'
  },
  about: {
    title: 'About',
    description: 'Excel to CSV Desktop Tool',
    developer: 'Developer: Nixevol',
    github: 'Visit GitHub'
  },
  log: {
    START_PROCESSING: '========== Start processing, total {total} file(s) ==========',
    CONVERSION_CANCELLED: 'Conversion manually cancelled by user!',
    READING_FILE: '\n---> Reading file [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: 'Cannot open file {file}: {error}',
    READ_SHEETS_SUCCESS: 'Successfully read {count} Sheet(s)',
    SKIP_SHEET: 'Skip Sheet [{current}/{total}] : {sheet} (Matches exclusion rule)',
    CONVERTING_SHEET: 'Converting Sheet [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: 'Failed to read {sheet}: {error}',
    CREATE_OUTPUT_FAILED: 'Failed to create output file: {error}',
    SAVE_SUCCESS: '  -> Successfully saved: {file}',
    ALL_TASKS_COMPLETED: '========== ✅ All tasks completed! =========='
  }
}
