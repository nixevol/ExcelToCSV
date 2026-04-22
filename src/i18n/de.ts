export default {
  languageLabel: 'Deutsch',
  theme: {
    dark: 'Dunkel',
    light: 'Hell'
  },
  filter: {
    title: 'Ausschlussregeln',
    modalTitle: 'Sheet-Ausschlussregeln',
    description: 'Sheets, deren Name diese Schlüsselwörter enthält, werden übersprungen. Drücken Sie Enter zum Hinzufügen.',
    placeholder: 'Bsp: Zusammenfassung',
    clearAll: 'Alle löschen',
    done: 'Fertig'
  },
  tooltip: {
    importFiles: 'Excel-Dateien importieren',
    clearList: 'Liste leeren'
  },
  table: {
    fileName: 'Dateiname',
    type: 'Typ',
    size: 'Größe',
    path: 'Pfad',
    actions: 'Aktionen',
    delete: 'Löschen',
    emptyHint: 'Dateien hierher ziehen oder auf {icon} klicken'
  },
  config: {
    namingRule: 'Benennungsregel',
    encoding: 'Codierung',
    threads: 'Threads',
    outputDir: 'Ausgabeverzeichnis',
    outputPlaceholder: 'Standard: Wie Quelle',
    select: 'Auswählen'
  },
  naming: {
    excelSheetTime: 'Excel-Sheet_Zeitstempel.csv',
    sheetTime: 'Sheet_Zeitstempel.csv',
    excelSheet: 'Excel-Sheet.csv'
  },
  button: {
    start: 'Starten',
    stop: 'Stopp'
  },
  status: {
    title: 'Aufgabenstatus',
    totalProgress: 'Gesamtfortschritt',
    files: 'Dateien',
    currentProcessing: 'Wird verarbeitet: ',
    fatalError: 'Schwerwiegender Fehler'
  },
  about: {
    title: 'Über',
    description: 'Excel zu CSV Desktop-Tool',
    developer: 'Entwickler: Nixevol',
    github: 'GitHub besuchen'
  },
  log: {
    START_PROCESSING: '========== Verarbeitung gestartet, insgesamt {total} Datei(en) ==========',
    CONVERSION_CANCELLED: 'Konvertierung vom Benutzer manuell abgebrochen!',
    READING_FILE: '\n---> Lese Datei [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: 'Datei {file} kann nicht geöffnet werden: {error}',
    READ_SHEETS_SUCCESS: 'Erfolgreich {count} Sheet(s) gelesen',
    SKIP_SHEET: 'Überspringe Sheet [{current}/{total}] : {sheet} (Stimmt mit Ausschlussregel überein)',
    CONVERTING_SHEET: 'Konvertiere Sheet [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: 'Fehler beim Lesen von {sheet}: {error}',
    CREATE_OUTPUT_FAILED: 'Fehler beim Erstellen der Ausgabedatei: {error}',
    SAVE_SUCCESS: '  -> Erfolgreich gespeichert: {file}',
    ALL_TASKS_COMPLETED: '========== ✅ Alle Aufgaben abgeschlossen! =========='
  }
}
