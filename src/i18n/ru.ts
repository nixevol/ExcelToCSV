export default {
  languageLabel: 'Русский',
  theme: {
    dark: 'Тёмная',
    light: 'Светлая'
  },
  filter: {
    title: 'Правила исключения',
    modalTitle: 'Правила исключения листов',
    description: 'Листы, содержащие любое из следующих ключевых слов, будут пропущены. Нажмите Enter, чтобы добавить ключевое слово.',
    placeholder: 'Например: Сводка',
    clearAll: 'Очистить всё',
    done: 'Готово'
  },
  tooltip: {
    importFiles: 'Импортировать файлы Excel',
    clearList: 'Очистить список'
  },
  table: {
    fileName: 'Имя файла',
    type: 'Тип',
    size: 'Размер',
    path: 'Путь',
    actions: 'Действия',
    delete: 'Удалить',
    emptyHint: 'Перетащите файлы сюда или нажмите {icon}, чтобы добавить'
  },
  config: {
    namingRule: 'Правило именования',
    encoding: 'Кодировка',
    threads: 'Потоки',
    outputDir: 'Папка вывода',
    outputPlaceholder: 'По умолчанию: как у исходного',
    select: 'Выбрать'
  },
  naming: {
    excelSheetTime: 'Excel-Лист_Время.csv',
    sheetTime: 'Лист_Время.csv',
    excelSheet: 'Excel-Лист.csv'
  },
  button: {
    start: 'Начать',
    stop: 'Остановить'
  },
  status: {
    title: 'Статус задачи',
    totalProgress: 'Общий прогресс',
    files: 'Файлы',
    currentProcessing: 'Обработка: ',
    fatalError: 'Фатальная ошибка'
  },
  about: {
    title: 'О программе',
    description: 'Конвертер Excel в CSV',
    developer: 'Разработчик: Nixevol',
    github: 'Перейти на GitHub'
  },
  log: {
    START_PROCESSING: '========== Начало обработки, всего файлов: {total} ==========',
    CONVERSION_CANCELLED: 'Конвертация отменена пользователем!',
    READING_FILE: '\n---> Чтение файла [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: 'Не удалось открыть файл {file}: {error}',
    READ_SHEETS_SUCCESS: 'Успешно прочитано листов: {count}',
    SKIP_SHEET: 'Пропуск листа [{current}/{total}] : {sheet} (совпадает с правилом исключения)',
    CONVERTING_SHEET: 'Конвертация листа [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: 'Не удалось прочитать {sheet}: {error}',
    CREATE_OUTPUT_FAILED: 'Не удалось создать выходной файл: {error}',
    SAVE_SUCCESS: '  -> Успешно сохранено: {file}',
    ALL_TASKS_COMPLETED: '========== ✅ Все задачи завершены! =========='
  }
}
