export default {
  languageLabel: 'Français',
  theme: {
    dark: 'Sombre',
    light: 'Clair'
  },
  filter: {
    title: 'Règles d\'exclusion',
    modalTitle: 'Règles d\'exclusion de feuilles',
    description: 'Les feuilles dont le nom contient ces mots-clés seront ignorées. Appuyez sur Entrée pour ajouter.',
    placeholder: 'Ex: Résumé',
    clearAll: 'Tout effacer',
    done: 'Terminé'
  },
  tooltip: {
    importFiles: 'Importer des fichiers Excel',
    clearList: 'Effacer la liste'
  },
  table: {
    fileName: 'Nom du fichier',
    type: 'Type',
    size: 'Taille',
    path: 'Chemin',
    actions: 'Actions',
    delete: 'Supprimer',
    emptyHint: 'Glissez les fichiers ici ou cliquez sur {icon} pour ajouter'
  },
  config: {
    namingRule: 'Règle de nommage',
    encoding: 'Encodage',
    threads: 'Fils d\'exécution',
    outputDir: 'Dossier de sortie',
    outputPlaceholder: 'Défaut: même que source',
    select: 'Sélectionner'
  },
  naming: {
    excelSheetTime: 'Excel-Feuille_Heure.csv',
    sheetTime: 'Feuille_Heure.csv',
    excelSheet: 'Excel-Feuille.csv'
  },
  button: {
    start: 'Démarrer',
    stop: 'Arrêter'
  },
  status: {
    title: 'État de la tâche',
    totalProgress: 'Progression totale',
    files: 'Fichiers',
    currentProcessing: 'Traitement en cours: ',
    fatalError: 'Erreur fatale'
  },
  about: {
    title: 'À propos',
    description: 'Outil de conversion Excel vers CSV',
    developer: 'Développeur: Nixevol',
    github: 'Visiter GitHub'
  },
  log: {
    START_PROCESSING: '========== Début du traitement, {total} fichier(s) au total ==========',
    CONVERSION_CANCELLED: 'Conversion annulée manuellement par l\'utilisateur !',
    READING_FILE: '\n---> Lecture du fichier [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: 'Impossible d\'ouvrir le fichier {file} : {error}',
    READ_SHEETS_SUCCESS: 'Lecture réussie de {count} feuille(s)',
    SKIP_SHEET: 'Saut de la feuille [{current}/{total}] : {sheet} (correspond à la règle)',
    CONVERTING_SHEET: 'Conversion de la feuille [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: 'Échec de la lecture de {sheet} : {error}',
    CREATE_OUTPUT_FAILED: 'Échec de création du fichier de sortie : {error}',
    SAVE_SUCCESS: '  -> Enregistré avec succès : {file}',
    ALL_TASKS_COMPLETED: '========== ✅ Toutes les tâches sont terminées ! =========='
  }
}
