import { AIConfig, getAIConfig, validateAIConfig } from './config';
import { AIAnalysisRequest, AIAnalysisResponse, ZiweiChart, DivinationResult } from '@/types';

// 定义API响应类型
interface SiliconFlowResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

// AI服务类
export class AIService {
  private config: AIConfig;

  constructor(provider?: string) {
    this.config = getAIConfig(provider);
  }

  // 验证配置
  isConfigured(): boolean {
    return validateAIConfig(this.config);
  }

  // 通用AI请求方法
  async makeRequest(messages: any[], options?: {
    maxTokens?: number;
    temperature?: number;
    enableThinking?: boolean;
  }): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('AI服务未正确配置，请检查API密钥');
    }

    // SiliconFlow特殊配置
    const requestBody: any = {
      model: this.config.model,
      messages,
      max_tokens: options?.maxTokens || this.config.maxTokens,
      temperature: options?.temperature || this.config.temperature,
      stream: false,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0.5,
      min_p: 0.05,
      n: 1,
      response_format: { type: "text" }
    };

    // 如果是DeepSeek-R1模型，添加思维链参数
    if (this.config.model.includes('DeepSeek-R1') && options?.enableThinking !== false) {
      requestBody.enable_thinking = true;
      requestBody.thinking_budget = 32768;
    }

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json() as SiliconFlowResponse;
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('AI服务请求错误:', error);
      throw new Error('AI服务暂时不可用，请稍后重试');
    }
  }

  // 紫薇斗数分析
  async analyzeZiweiChart(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (request.type !== 'ziwei') {
      throw new Error('请求类型不匹配');
    }

    const chart = request.data as ZiweiChart;
    const systemPrompt = `你是一位精通倪海厦理论的紫薇斗数专家。请基于以下命盘信息，提供专业的运势分析。

分析要求：
1. 基于倪海厦先生的理论体系
2. 分析命格特质、财运、事业、感情等方面
3. 提供具体的建议和指导
4. 语言要专业但易懂
5. 分析要客观中肯

请用中文回复，字数控制在800-1200字。`;

    const userPrompt = `请分析以下紫薇斗数命盘：

出生信息：
- 性别：${chart.birthInfo.gender === 'male' ? '男' : '女'}
- 农历生日：${chart.birthInfo.lunarDate.year}年${chart.birthInfo.lunarDate.month}月${chart.birthInfo.lunarDate.day}日
- 时辰：${chart.birthInfo.lunarDate.hourName}

命盘信息：
- 命宫位置：第${chart.mainPalace + 1}宫
- 身宫位置：第${chart.bodyPalace + 1}宫

请提供详细的运势分析。`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const analysis = await this.makeRequest(messages, { enableThinking: true });
      
      return {
        analysis,
        confidence: 0.85,
        suggestions: [
          '建议定期关注运势变化',
          '保持积极心态面对挑战',
          '注重个人修养和学习'
        ]
      };
    } catch (error) {
      throw error;
    }
  }

  // 周易卦象解读
  async interpretHexagram(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (request.type !== 'iching') {
      throw new Error('请求类型不匹配');
    }

    const divination = request.data as DivinationResult;
    const systemPrompt = `你是一位精通周易的占卜专家，熟悉倪海厦先生的易学理论。请基于传统周易理论，为用户的问题提供专业的卦象解读。

解读要求：
1. 基于传统周易六十四卦理论
2. 结合倪海厦的易学思想
3. 针对用户的具体问题给出指导
4. 解读要客观理性，不可过分神秘化
5. 提供实用的建议

请用中文回复，字数控制在600-800字。`;

    const userPrompt = `请解读以下卦象：

用户问题：${divination.question}

卦象信息：
- 卦名：${divination.originalHexagram.name}
- 上卦：${divination.originalHexagram.upperTrigram.name}
- 下卦：${divination.originalHexagram.lowerTrigram.name}
- 卦辞：${divination.originalHexagram.judgment}

请针对用户的问题，提供详细的卦象解读和建议。`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const analysis = await this.makeRequest(messages, { enableThinking: true });
      
      return {
        analysis,
        confidence: 0.80,
        suggestions: [
          '卦象仅供参考，最终决定权在您',
          '保持内心平静，理性思考',
          '适时调整策略和方向'
        ]
      };
    } catch (error) {
      throw error;
    }
  }
}

// 默认AI服务实例
export const defaultAIService = new AIService('deepseek');

// 便捷方法
export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  return request.type === 'ziwei' 
    ? await defaultAIService.analyzeZiweiChart(request)
    : await defaultAIService.interpretHexagram(request);
} 