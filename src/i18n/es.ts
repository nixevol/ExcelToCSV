export default {
  languageLabel: 'Español',
  theme: {
    dark: 'Oscuro',
    light: 'Claro'
  },
  filter: {
    title: 'Reglas de exclusión',
    modalTitle: 'Reglas de exclusión de hojas',
    description: 'Se omitirán las hojas que contengan estas palabras clave. Pulse Intro para añadir.',
    placeholder: 'Ej: Resumen',
    clearAll: 'Borrar todo',
    done: 'Hecho'
  },
  tooltip: {
    importFiles: 'Importar archivos Excel',
    clearList: 'Borrar lista'
  },
  table: {
    fileName: 'Nombre de archivo',
    type: 'Tipo',
    size: 'Tamaño',
    path: 'Ruta',
    actions: 'Acciones',
    delete: 'Eliminar',
    emptyHint: 'Arrastre los archivos aquí o haga clic en {icon} para añadir'
  },
  config: {
    namingRule: 'Regla de nomenclatura',
    encoding: 'Codificación',
    threads: 'Subprocesos',
    outputDir: 'Carpeta de salida',
    outputPlaceholder: 'Por defecto: igual que el origen',
    select: 'Seleccionar'
  },
  naming: {
    excelSheetTime: 'Excel-Hoja_Hora.csv',
    sheetTime: 'Hoja_Hora.csv',
    excelSheet: 'Excel-Hoja.csv'
  },
  button: {
    start: 'Iniciar',
    stop: 'Detener'
  },
  status: {
    title: 'Estado de la tarea',
    totalProgress: 'Progreso total',
    files: 'Archivos',
    currentProcessing: 'Procesando: ',
    fatalError: 'Error fatal'
  },
  about: {
    title: 'Acerca de',
    description: 'Herramienta de conversión de Excel a CSV',
    developer: 'Desarrollador: Nixevol',
    github: 'Visitar GitHub'
  },
  log: {
    START_PROCESSING: '========== Inicio del procesamiento, total {total} archivo(s) ==========',
    CONVERSION_CANCELLED: '¡Conversión cancelada manualmente por el usuario!',
    READING_FILE: '\n---> Leyendo archivo [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: 'No se puede abrir el archivo {file}: {error}',
    READ_SHEETS_SUCCESS: 'Lectura correcta de {count} hoja(s)',
    SKIP_SHEET: 'Saltar hoja [{current}/{total}] : {sheet} (Coincide con regla exclusión)',
    CONVERTING_SHEET: 'Convirtiendo hoja [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: 'Error al leer {sheet}: {error}',
    CREATE_OUTPUT_FAILED: 'Error al crear archivo de salida: {error}',
    SAVE_SUCCESS: '  -> Guardado con éxito: {file}',
    ALL_TASKS_COMPLETED: '========== ✅ ¡Todas las tareas completadas! =========='
  }
}
