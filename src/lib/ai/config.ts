// AI服务配置
export interface AIConfig {
  provider: 'deepseek' | 'openai' | 'anthropic';
  apiKey: string;
  baseURL: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

// DeepSeek配置
export const deepseekConfig: AIConfig = {
  provider: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  model: process.env.DEEPSEEK_MODEL || 'deepseek-ai/DeepSeek-R1',
  maxTokens: 4000,
  temperature: 0.7
};

// OpenAI配置（备用）
export const openaiConfig: AIConfig = {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  model: 'gpt-3.5-turbo',
  maxTokens: 4000,
  temperature: 0.7
};

// 默认配置
export const defaultAIConfig = deepseekConfig;

// 获取AI配置
export function getAIConfig(provider?: string): AIConfig {
  switch (provider) {
    case 'openai':
      return openaiConfig;
    case 'deepseek':
    default:
      return deepseekConfig;
  }
}

// 验证配置
export function validateAIConfig(config: AIConfig): boolean {
  return !!(config.apiKey && config.baseURL && config.model);
} 