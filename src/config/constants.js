// 인증 관련
export const AUTH_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// 페이지네이션
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// 프로그램 상태
export const PROGRAM_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 신청 상태
export const REGISTRATION_STATUS = {
  UPCOMING: 'upcoming',
  COMPLETED: 'completed'
};

// 시간 포맷
export const TIMEZONE = '+09:00';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  ONBOARDING_INTERESTS: "/onboarding/interests",
  PROGRAMS: '/programs',
  EXPLORE: '/explore',
  CAREER: '/careermap',
  COMMUNITY: '/community',
  ASSISTANT: '/assistant',
  ME: '/my',
  ME_REGISTRATIONS: '/my/registrations',
  ME_LIKES: '/my/likes'
};

// 관심 분야 카테고리 (서버와 동일한 구조)
export const INTEREST_CATEGORIES = [
  { code: 0, label: "인문·사회과학 연구직" },
  { code: 1, label: "자연·생명과학 연구직" },
  { code: 2, label: "정보통신 연구개발직 및 공학기술직" },
  { code: 3, label: "건설·채굴 연구개발직 및 공학기술직" },
  { code: 4, label: "제조 연구개발직 및 공학기술직" },
  { code: 5, label: "사회복지·종교직" },
  { code: 6, label: "교육직" },
  { code: 7, label: "법률직" },
  { code: 8, label: "경찰·소방·교도직" },
  { code: 9, label: "군인" },
  { code: 10, label: "보건·의료직" },
  { code: 11, label: "예술·디자인·방송직" },
  { code: 12, label: "스포츠·레크리에이션직" },
  { code: 13, label: "경호·경비직" },
  { code: 14, label: "돌봄 서비스직(간병·육아)" },
  { code: 15, label: "청소 및 기타 개인서비스직" },
  { code: 16, label: "미용·예식 서비스직" },
  { code: 17, label: "여행·숙박·오락 서비스직" },
  { code: 18, label: "음식 서비스직" },
  { code: 19, label: "영업·판매직" },
  { code: 20, label: "운전·운송직" },
  { code: 21, label: "건설·채굴직" },
  { code: 22, label: "식품 가공·생산직" },
  { code: 23, label: "인쇄·목재·공예 및 기타 설치·정비·생산직" },
  { code: 24, label: "제조 단순직" },
  { code: 25, label: "기계 설치·정비·생산직" },
  { code: 26, label: "금속·재료 설치·정비·생산직(판금·단조·주조·용접·도장 등)" },
  { code: 27, label: "전기·전자 설치·정비·생산직" },
  { code: 28, label: "정보통신 설치·정비직" },
  { code: 29, label: "화학·환경 설치·정비·생산직" },
  { code: 30, label: "섬유·의복 생산직" },
  { code: 31, label: "농림어업직" }
];

// 1) 코드(숫자) 고정: enum처럼 사용
export const INTEREST_CODES = Object.freeze({
  HUM_SOC_RESEARCH: 0,
  NAT_BIO_RESEARCH: 1,
  ICT_RND_ENGINEERING: 2,
  CONSTR_MINING_RND_ENGINEERING: 3,
  MANUFACTURING_RND_ENGINEERING: 4,
  WELFARE_RELIGION: 5,
  EDUCATION: 6,
  LAW: 7,
  POLICE_FIRE_CORRECTION: 8,
  MILITARY: 9,
  HEALTH_MEDICAL: 10,
  ARTS_DESIGN_MEDIA: 11,
  SPORTS_RECREATION: 12,
  SECURITY_GUARD: 13,
  CARE_SERVICE: 14, // 간병·육아
  CLEANING_PERSONAL_SERVICE: 15,
  BEAUTY_WEDDING_SERVICE: 16,
  TRAVEL_LODGING_ENTERTAINMENT: 17,
  FOOD_SERVICE: 18,
  SALES: 19,
  DRIVING_TRANSPORT: 20,
  CONSTRUCTION_MINING: 21,
  FOOD_PROCESSING_PRODUCTION: 22,
  PRINT_WOOD_CRAFT_ETC_INSTALL_MAINT_PROD: 23,
  MANUFACTURING_SIMPLE: 24,
  MACHINE_INSTALL_MAINT_PROD: 25,
  METAL_MATERIAL_INSTALL_MAINT_PROD: 26, // 판금·단조·주조·용접·도장 등
  ELECTRICAL_ELECTRONIC_INSTALL_MAINT_PROD: 27,
  ICT_INSTALL_MAINT: 28,
  CHEM_ENV_INSTALL_MAINT_PROD: 29,
  TEXTILE_APPAREL_PROD: 30,
  AGRI_FISHERY: 31,
});

// 2) 코드 → 라벨
export const INTEREST_LABELS = Object.freeze({
  [INTEREST_CODES.HUM_SOC_RESEARCH]: "인문·사회과학 연구직",
  [INTEREST_CODES.NAT_BIO_RESEARCH]: "자연·생명과학 연구직",
  [INTEREST_CODES.ICT_RND_ENGINEERING]: "정보통신 연구개발직 및 공학기술직",
  [INTEREST_CODES.CONSTR_MINING_RND_ENGINEERING]: "건설·채굴 연구개발직 및 공학기술직",
  [INTEREST_CODES.MANUFACTURING_RND_ENGINEERING]: "제조 연구개발직 및 공학기술직",
  [INTEREST_CODES.WELFARE_RELIGION]: "사회복지·종교직",
  [INTEREST_CODES.EDUCATION]: "교육직",
  [INTEREST_CODES.LAW]: "법률직",
  [INTEREST_CODES.POLICE_FIRE_CORRECTION]: "경찰·소방·교도직",
  [INTEREST_CODES.MILITARY]: "군인",
  [INTEREST_CODES.HEALTH_MEDICAL]: "보건·의료직",
  [INTEREST_CODES.ARTS_DESIGN_MEDIA]: "예술·디자인·방송직",
  [INTEREST_CODES.SPORTS_RECREATION]: "스포츠·레크리에이션직",
  [INTEREST_CODES.SECURITY_GUARD]: "경호·경비직",
  [INTEREST_CODES.CARE_SERVICE]: "돌봄 서비스직(간병·육아)",
  [INTEREST_CODES.CLEANING_PERSONAL_SERVICE]: "청소 및 기타 개인서비스직",
  [INTEREST_CODES.BEAUTY_WEDDING_SERVICE]: "미용·예식 서비스직",
  [INTEREST_CODES.TRAVEL_LODGING_ENTERTAINMENT]: "여행·숙박·오락 서비스직",
  [INTEREST_CODES.FOOD_SERVICE]: "음식 서비스직",
  [INTEREST_CODES.SALES]: "영업·판매직",
  [INTEREST_CODES.DRIVING_TRANSPORT]: "운전·운송직",
  [INTEREST_CODES.CONSTRUCTION_MINING]: "건설·채굴직",
  [INTEREST_CODES.FOOD_PROCESSING_PRODUCTION]: "식품 가공·생산직",
  [INTEREST_CODES.PRINT_WOOD_CRAFT_ETC_INSTALL_MAINT_PROD]: "인쇄·목재·공예 및 기타 설치·정비·생산직",
  [INTEREST_CODES.MANUFACTURING_SIMPLE]: "제조 단순직",
  [INTEREST_CODES.MACHINE_INSTALL_MAINT_PROD]: "기계 설치·정비·생산직",
  [INTEREST_CODES.METAL_MATERIAL_INSTALL_MAINT_PROD]: "금속·재료 설치·정비·생산직(판금·단조·주조·용접·도장 등)",
  [INTEREST_CODES.ELECTRICAL_ELECTRONIC_INSTALL_MAINT_PROD]: "전기·전자 설치·정비·생산직",
  [INTEREST_CODES.ICT_INSTALL_MAINT]: "정보통신 설치·정비직",
  [INTEREST_CODES.CHEM_ENV_INSTALL_MAINT_PROD]: "화학·환경 설치·정비·생산직",
  [INTEREST_CODES.TEXTILE_APPAREL_PROD]: "섬유·의복 생산직",
  [INTEREST_CODES.AGRI_FISHERY]: "농림어업직",
});

// 3) 화면 노출 순서 (언제든 바꿔도 API 코드는 고정)
export const INTEREST_DISPLAY_ORDER = [
  INTEREST_CODES.HUM_SOC_RESEARCH,
  INTEREST_CODES.NAT_BIO_RESEARCH,
  INTEREST_CODES.ICT_RND_ENGINEERING,
  INTEREST_CODES.CONSTR_MINING_RND_ENGINEERING,
  INTEREST_CODES.MANUFACTURING_RND_ENGINEERING,
  INTEREST_CODES.WELFARE_RELIGION,
  INTEREST_CODES.EDUCATION,
  INTEREST_CODES.LAW,
  INTEREST_CODES.POLICE_FIRE_CORRECTION,
  INTEREST_CODES.MILITARY,
  INTEREST_CODES.HEALTH_MEDICAL,
  INTEREST_CODES.ARTS_DESIGN_MEDIA,
  INTEREST_CODES.SPORTS_RECREATION,
  INTEREST_CODES.SECURITY_GUARD,
  INTEREST_CODES.CARE_SERVICE,
  INTEREST_CODES.CLEANING_PERSONAL_SERVICE,
  INTEREST_CODES.BEAUTY_WEDDING_SERVICE,
  INTEREST_CODES.TRAVEL_LODGING_ENTERTAINMENT,
  INTEREST_CODES.FOOD_SERVICE,
  INTEREST_CODES.SALES,
  INTEREST_CODES.DRIVING_TRANSPORT,
  INTEREST_CODES.CONSTRUCTION_MINING,
  INTEREST_CODES.FOOD_PROCESSING_PRODUCTION,
  INTEREST_CODES.PRINT_WOOD_CRAFT_ETC_INSTALL_MAINT_PROD,
  INTEREST_CODES.MANUFACTURING_SIMPLE,
  INTEREST_CODES.MACHINE_INSTALL_MAINT_PROD,
  INTEREST_CODES.METAL_MATERIAL_INSTALL_MAINT_PROD,
  INTEREST_CODES.ELECTRICAL_ELECTRONIC_INSTALL_MAINT_PROD,
  INTEREST_CODES.ICT_INSTALL_MAINT,
  INTEREST_CODES.CHEM_ENV_INSTALL_MAINT_PROD,
  INTEREST_CODES.TEXTILE_APPAREL_PROD,
  INTEREST_CODES.AGRI_FISHERY,
];

// 4) 역방향 맵(라벨 → 코드)
export const INTEREST_CODE_BY_LABEL = Object.freeze(
  Object.fromEntries(Object.entries(INTEREST_LABELS).map(([code, label]) => [label, Number(code)]))
);

export const INTEREST_GROUPS = [
  {
    key: "research_engineering",
    label: "연구직 및 공학 기술직",
    codes: [
      INTEREST_CODES.HUM_SOC_RESEARCH,
      INTEREST_CODES.NAT_BIO_RESEARCH,
      INTEREST_CODES.ICT_RND_ENGINEERING,
      INTEREST_CODES.CONSTR_MINING_RND_ENGINEERING,
      INTEREST_CODES.MANUFACTURING_RND_ENGINEERING,
    ],
  },
  {
    key: "edu_law_welfare_police_military",
    label: "교육·법률·사회복지·경찰·소방직 및 군인",
    codes: [
      INTEREST_CODES.WELFARE_RELIGION,
      INTEREST_CODES.EDUCATION,
      INTEREST_CODES.LAW,
      INTEREST_CODES.POLICE_FIRE_CORRECTION,
      INTEREST_CODES.MILITARY,
    ],
  },
  {
    key: "health_medical",
    label: "보건·의료직",
    codes: [INTEREST_CODES.HEALTH_MEDICAL],
  },
  {
    key: "arts_design_media_sports",
    label: "예술·디자인·방송·스포츠직",
    codes: [
      INTEREST_CODES.ARTS_DESIGN_MEDIA,
      INTEREST_CODES.SPORTS_RECREATION,
    ],
  },
  {
    key: "beauty_travel_food_security_cleaning",
    label: "미용·여행·숙박·음식·경비·청소직",
    codes: [
      INTEREST_CODES.SECURITY_GUARD,
      INTEREST_CODES.CARE_SERVICE,
      INTEREST_CODES.CLEANING_PERSONAL_SERVICE,
      INTEREST_CODES.BEAUTY_WEDDING_SERVICE,
      INTEREST_CODES.TRAVEL_LODGING_ENTERTAINMENT,
      INTEREST_CODES.FOOD_SERVICE,
    ],
  },
  {
    key: "sales_driving_transport",
    label: "영업·판매·운전·운송직",
    codes: [INTEREST_CODES.SALES, INTEREST_CODES.DRIVING_TRANSPORT],
  },
  {
    key: "construction_mining",
    label: "건설·채굴직",
    codes: [INTEREST_CODES.CONSTRUCTION_MINING],
  },
  {
    key: "install_maint_production",
    label: "설치·정비·생산직",
    codes: [
      INTEREST_CODES.FOOD_PROCESSING_PRODUCTION,
      INTEREST_CODES.PRINT_WOOD_CRAFT_ETC_INSTALL_MAINT_PROD,
      INTEREST_CODES.MANUFACTURING_SIMPLE,
      INTEREST_CODES.MACHINE_INSTALL_MAINT_PROD,
      INTEREST_CODES.METAL_MATERIAL_INSTALL_MAINT_PROD,
      INTEREST_CODES.ELECTRICAL_ELECTRONIC_INSTALL_MAINT_PROD,
      INTEREST_CODES.ICT_INSTALL_MAINT,
      INTEREST_CODES.CHEM_ENV_INSTALL_MAINT_PROD,
      INTEREST_CODES.TEXTILE_APPAREL_PROD,
    ],
  },
  {
    key: "agri_fishery",
    label: "농림어업직",
    codes: [INTEREST_CODES.AGRI_FISHERY],
  },
];

// 라벨 헬퍼(그룹 뿌릴 때 사용)
export const getLabelByCode = (code) => INTEREST_LABELS[code] ?? String(code);