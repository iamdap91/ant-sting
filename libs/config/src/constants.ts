export enum NODE_ENV {
  /** 개발 환경 */
  DEVELOPMENT = 'development',

  /** 테스트 환경 */
  TEST = 'test',

  /** 운영 환경 */
  PRODUCTION = 'production',
}

export enum DB_NAME {
  ANT_STING = 'ant-sting',
}

export enum QUEUE_NAME {
  // 네이버 증권 (시황, 투자, 경제, 채권)
  ECONOMIC_INFORMATION = 'ECONOMIC_INFORMATION',
  // 증권사 리포트 PDF 분석
  ANALYZE_STOCK = 'ANALYZE_STOCK',
}
