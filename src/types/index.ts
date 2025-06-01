// 基础类型定义
export interface LunarDate {
  year: number;          // 农历年
  month: number;         // 农历月 (1-12)
  day: number;           // 农历日 (1-30)
  isLeapMonth: boolean;  // 是否闰月
  hour: number;          // 时辰 (0-11)
  hourName: string;      // 时辰名称
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface TimeHour {
  index: number;         // 时辰序号 (0-11)
  name: string;          // 时辰名称
  startTime: string;     // 开始时间
  endTime: string;       // 结束时间
  earthlyBranch: string; // 地支
}

// 出生信息
export interface BirthInfo {
  lunarDate: LunarDate;
  gender: 'male' | 'female';
  birthPlace?: {
    longitude: number;
    latitude: number;
  };
}

// 紫薇斗数相关类型
export interface Palace {
  id: number;           // 宫位ID (0-11)
  name: string;         // 宫位名称
  position: number;     // 在命盘中的位置
  earthlyBranch: string; // 地支
  stars: Star[];        // 该宫位的星宿
  isMainPalace: boolean; // 是否为命宫
  isBodyPalace: boolean; // 是否为身宫
}

export interface Star {
  id: string;           // 星宿ID
  name: string;         // 星宿名称
  type: 'main' | 'auxiliary' | 'minor'; // 星宿类型
  brightness: 'bright' | 'normal' | 'dim'; // 亮度
  position: number;     // 所在宫位
  description: string;  // 星宿描述
}

export interface ZiweiChart {
  birthInfo: BirthInfo;
  palaces: Palace[];
  mainStars: Star[];
  auxiliaryStars: Star[];
  minorStars: Star[];
  mainPalace: number;   // 命宫位置
  bodyPalace: number;   // 身宫位置
}

// 周易相关类型
export interface Trigram {
  id: number;
  name: string;
  symbol: string;       // 卦象符号 ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷
  binary: string;       // 二进制表示 111, 110, 101, etc.
  element: string;      // 五行属性
  direction: string;    // 方位
  meaning: string;      // 含义
}

export interface Line {
  position: number;     // 爻位 (1-6)
  type: 'yin' | 'yang'; // 阴爻或阳爻
  isChanging: boolean;  // 是否为变爻
  text: string;         // 爻辞
}

export interface Hexagram {
  id: number;           // 卦序号 (1-64)
  name: string;         // 卦名
  upperTrigram: Trigram; // 上卦
  lowerTrigram: Trigram; // 下卦
  lines: Line[];        // 六爻
  judgment: string;     // 卦辞
  image: string;        // 象辞
  sequence: number;     // 序卦
}

export interface DivinationResult {
  question: string;     // 占卜问题
  originalHexagram: Hexagram; // 本卦
  changedHexagram?: Hexagram; // 变卦
  changingLines: number[];    // 变爻位置
  interpretation: string;     // 解读结果
  timestamp: Date;      // 占卜时间
}

// 用户数据相关类型
export interface UserProfile {
  id: string;
  name: string;
  birthInfo: BirthInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface FortuneRecord {
  id: string;
  profileId: string;
  chart: ZiweiChart;
  analysis: string;
  createdAt: Date;
}

export interface DivinationRecord {
  id: string;
  question: string;
  result: DivinationResult;
  interpretation: string;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  notifications: boolean;
  autoSave: boolean;
}

export interface UserData {
  profiles: UserProfile[];
  history: {
    fortune: FortuneRecord[];
    divination: DivinationRecord[];
  };
  preferences: UserPreferences;
  version: string;
}

// API相关类型
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AIAnalysisRequest {
  type: 'ziwei' | 'iching';
  data: ZiweiChart | DivinationResult;
  options?: {
    language?: 'zh-CN' | 'en-US';
    detail?: 'brief' | 'detailed';
    focus?: string[]; // 重点分析领域
  };
}

export interface AIAnalysisResponse {
  analysis: string;
  confidence: number;
  suggestions: string[];
  warnings?: string[];
}

// 错误处理类型
export enum ErrorCode {
  INVALID_DATE = 'INVALID_DATE',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  AI_API_ERROR = 'AI_API_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  timestamp: Date;
} 