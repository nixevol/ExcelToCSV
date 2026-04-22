export default {
  languageLabel: '日本語',
  theme: {
    dark: 'ダーク',
    light: 'ライト'
  },
  filter: {
    title: '除外ルール',
    modalTitle: 'Sheet 除外ルールの設定',
    description: '以下のキーワードが含まれるSheetは変換をスキップします。入力後Enterで追加。',
    placeholder: '例: 概要',
    clearAll: 'すべてクリア',
    done: '完了'
  },
  tooltip: {
    importFiles: 'Excelファイルをインポート',
    clearList: 'リストをクリア'
  },
  table: {
    fileName: 'ファイル名',
    type: '種類',
    size: 'サイズ',
    path: 'パス',
    actions: '操作',
    delete: '削除',
    emptyHint: 'ファイルをドラッグするか、{icon}をクリックして追加'
  },
  config: {
    namingRule: '命名規則',
    encoding: 'エンコード',
    threads: 'スレッド数',
    outputDir: '出力先',
    outputPlaceholder: 'デフォルト: 元のフォルダ',
    select: '選択'
  },
  naming: {
    excelSheetTime: 'Excel名-Sheet名_タイムスタンプ.csv',
    sheetTime: 'Sheet名_タイムスタンプ.csv',
    excelSheet: 'Excel名-Sheet名.csv'
  },
  button: {
    start: '変換開始',
    stop: '停止'
  },
  status: {
    title: 'タスクのステータス',
    totalProgress: '全体の進捗',
    files: 'ファイル',
    currentProcessing: '処理中：',
    fatalError: '致命的なエラー'
  },
  about: {
    title: '概要',
    description: 'Excel から CSV へのデスクトップツール',
    developer: '開発者：Nixevol',
    github: 'GitHubにアクセス'
  },
  log: {
    START_PROCESSING: '========== 処理を開始します。合計 {total} ファイル ==========',
    CONVERSION_CANCELLED: '変換はユーザーによってキャンセルされました！',
    READING_FILE: '\n---> ファイルの読み込み [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: 'ファイル {file} を開けません: {error}',
    READ_SHEETS_SUCCESS: '{count} 個のSheetの読み込みに成功しました',
    SKIP_SHEET: 'Sheetをスキップ [{current}/{total}] : {sheet} (除外ルールに一致)',
    CONVERTING_SHEET: 'Sheetを変換中 [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: '{sheet} の読み込みに失敗しました: {error}',
    CREATE_OUTPUT_FAILED: '出力ファイルの作成に失敗しました: {error}',
    SAVE_SUCCESS: '  -> 保存成功: {file}',
    ALL_TASKS_COMPLETED: '========== ✅ 全てのタスクが完了しました！ =========='
  }
}
