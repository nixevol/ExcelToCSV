export default {
  languageLabel: '한국어',
  theme: {
    dark: '다크',
    light: '라이트'
  },
  filter: {
    title: '제외 키워드 설정',
    modalTitle: '시트 제외 규칙 설정',
    description: '시트 이름에 다음 키워드가 포함되면 변환을 건너뜁니다. 키워드 입력 후 Enter로 추가하세요.',
    placeholder: '예: 요약',
    clearAll: '모두 지우기',
    done: '완료'
  },
  tooltip: {
    importFiles: 'Excel 파일 가져오기',
    clearList: '목록 지우기'
  },
  table: {
    fileName: '파일 이름',
    type: '유형',
    size: '크기',
    path: '경로',
    actions: '작업',
    delete: '삭제',
    emptyHint: '여기로 파일을 드래그하거나 {icon}을 클릭하여 추가'
  },
  config: {
    namingRule: '이름 지정 규칙',
    encoding: '파일 인코딩',
    threads: '스레드 수',
    outputDir: '출력 폴더',
    outputPlaceholder: '기본값: 원본 폴더와 동일',
    select: '선택'
  },
  naming: {
    excelSheetTime: 'Excel이름-시트이름_타임스탬프.csv',
    sheetTime: '시트이름_타임스탬프.csv',
    excelSheet: 'Excel이름-시트이름.csv'
  },
  button: {
    start: '변환 시작',
    stop: '변환 중지'
  },
  status: {
    title: '작업 상태',
    totalProgress: '전체 진행률',
    files: '파일',
    currentProcessing: '현재 처리 중: ',
    fatalError: '치명적 오류'
  },
  about: {
    title: '정보',
    description: 'Excel을 CSV로 변환하는 데스크톱 도구',
    developer: '개발자: Nixevol',
    github: 'GitHub 방문'
  },
  log: {
    START_PROCESSING: '========== 처리 시작, 총 {total}개 파일 ==========',
    CONVERSION_CANCELLED: '사용자가 변환을 수동으로 취소했습니다!',
    READING_FILE: '\n---> 파일 읽기 시작 [{current}/{total}] : {file}',
    OPEN_FILE_FAILED: '{file} 파일을 열 수 없습니다: {error}',
    READ_SHEETS_SUCCESS: '{count}개 시트 읽기 성공',
    SKIP_SHEET: '시트 건너뛰기 [{current}/{total}] : {sheet} (제외 규칙과 일치)',
    CONVERTING_SHEET: '시트 변환 중 [{current}/{total}] : {sheet}',
    READ_SHEET_FAILED: '{sheet} 읽기 실패: {error}',
    CREATE_OUTPUT_FAILED: '출력 파일 생성 실패: {error}',
    SAVE_SUCCESS: '  -> 저장 성공: {file}',
    ALL_TASKS_COMPLETED: '========== ✅ 모든 작업 완료! =========='
  }
}
