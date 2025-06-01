// 知识库提取器
// 用于从倪海厦的PDF教材中提取紫薇斗数和周易相关知识

import { pdfParser } from './pdf-parser';

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'ziwei' | 'iching' | 'general';
  source: string;
  keywords: string[];
}

export interface KnowledgeBase {
  items: KnowledgeItem[];
  categories: {
    ziwei: KnowledgeItem[];
    iching: KnowledgeItem[];
    general: KnowledgeItem[];
  };
}

// 倪海厦紫薇斗数核心理论知识
export const ZIWEI_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'ziwei_basic_theory',
    title: '紫薇斗数基本理论',
    content: `
紫薇斗数是中国古代占星学的重要分支，以紫薇星为主星，配合其他十三颗主星，
结合十二宫位来推断人的命运。倪海厦先生强调，紫薇斗数的核心在于：

1. 命宫的重要性：命宫是整个命盘的核心，决定了一个人的基本性格和命运走向。
2. 星宿组合：不同星宿的组合会产生不同的效果，需要综合分析。
3. 宫位意义：十二宫位各有其特定含义，需要结合星宿来解读。
4. 时间因素：大运、流年的变化会影响命运的展现。

倪师特别强调，紫薇斗数不是宿命论，而是帮助人了解自己的工具。
    `,
    category: 'ziwei',
    source: '倪海厦天纪教材',
    keywords: ['紫薇斗数', '命宫', '星宿', '十二宫', '倪海厦']
  },
  {
    id: 'ziwei_main_stars',
    title: '十四主星特性',
    content: `
十四主星是紫薇斗数的核心，每颗星都有其独特的性质：

紫薇星：帝王星，主贵气，有领导能力，但容易孤高。
天机星：智慧星，主谋略，善于思考，但容易多虑。
太阳星：父亲星，主权威，有正义感，但容易刚强。
武曲星：财星，主财富，有执行力，但容易固执。
天同星：福星，主享受，性格温和，但容易懒散。
廉贞星：囚星，主变化，有才华，但容易冲动。
天府星：财库星，主稳定，有组织能力，但容易保守。
太阴星：母亲星，主柔情，有包容心，但容易多愁。
贪狼星：欲望星，主多才，有魅力，但容易贪心。
巨门星：暗星，主口舌，有辩才，但容易是非。
天相星：印星，主辅佐，有责任心，但容易依赖。
天梁星：荫星，主庇护，有长者风范，但容易固执。
七杀星：将星，主冲动，有行动力，但容易暴躁。
破军星：耗星，主破坏，有开创力，但容易破坏。
    `,
    category: 'ziwei',
    source: '倪海厦天纪教材',
    keywords: ['十四主星', '紫薇', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军']
  },
  {
    id: 'ziwei_palace_meanings',
    title: '十二宫位含义',
    content: `
十二宫位代表人生的不同方面：

命宫：主要性格特质，人生基调
兄弟宫：兄弟姐妹关系，朋友缘分
夫妻宫：婚姻感情，配偶状况
子女宫：子女缘分，创作能力
财帛宫：财运状况，赚钱能力
疾厄宫：健康状况，身体素质
迁移宫：外出运势，人际关系
奴仆宫：下属关系，朋友助力
官禄宫：事业发展，工作状况
田宅宫：不动产，家庭环境
福德宫：精神享受，福分厚薄
父母宫：父母关系，长辈缘分

倪师强调，要结合星宿来看宫位，不能单独解读。
    `,
    category: 'ziwei',
    source: '倪海厦天纪教材',
    keywords: ['十二宫位', '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫']
  },
  {
    id: 'ziwei_calculation_method',
    title: '紫薇斗数排盘方法',
    content: `
倪海厦先生传授的紫薇斗数排盘方法：

1. 命宫计算：
   - 寅宫起正月，顺数到生月
   - 从生月宫起子时，顺数到生时
   - 此宫即为命宫

2. 身宫计算：
   - 从命宫开始，加上月份和时辰数
   - 减去2，得到身宫位置

3. 紫薇星定位：
   - 根据农历生日确定紫薇星位置
   - 其他主星按固定规律排布

4. 辅星排布：
   - 左辅右弼按月份排布
   - 文昌文曲按时辰排布
   - 禄存按年干排布
   - 其他煞星按相应规律排布

倪师强调，排盘必须准确，否则分析会有偏差。
    `,
    category: 'ziwei',
    source: '倪海厦天纪教材',
    keywords: ['排盘方法', '命宫计算', '身宫计算', '紫薇星', '辅星', '煞星']
  }
];

// 倪海厦周易理论知识
export const ICHING_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'iching_basic_theory',
    title: '周易基本理论',
    content: `
倪海厦先生对周易的理解：

周易是中华文化的根源，包含了宇宙运行的规律。其核心理念：

1. 阴阳理论：万物皆有阴阳，阴阳相互转化
2. 五行理论：金木水火土相生相克
3. 八卦理论：乾坤震巽坎离艮兑代表八种基本状态
4. 六十四卦：八卦相重，形成六十四种变化

倪师强调，周易不是迷信，而是古人对自然规律的总结。
占卜只是其应用之一，更重要的是理解其中的哲学思想。
    `,
    category: 'iching',
    source: '倪海厦天纪教材',
    keywords: ['周易', '阴阳', '五行', '八卦', '六十四卦', '倪海厦']
  },
  {
    id: 'iching_eight_trigrams',
    title: '八卦基本含义',
    content: `
八卦的基本含义和象征：

乾卦（☰）：天，父，君，金，西北，刚健
兑卦（☱）：泽，少女，口，金，西，喜悦
离卦（☲）：火，中女，目，火，南，光明
震卦（☳）：雷，长男，足，木，东，动
巽卦（☴）：风，长女，股，木，东南，顺
坎卦（☵）：水，中男，耳，水，北，险
艮卦（☶）：山，少男，手，土，东北，止
坤卦（☷）：地，母，腹，土，西南，顺

倪师强调，八卦不仅是符号，更代表了八种基本的自然现象和人事状态。
    `,
    category: 'iching',
    source: '倪海厦天纪教材',
    keywords: ['八卦', '乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
  },
  {
    id: 'iching_divination_method',
    title: '周易占卜方法',
    content: `
倪海厦先生传授的占卜方法：

1. 投币法（最常用）：
   - 用三枚铜钱，正面为阳（3），反面为阴（2）
   - 投掷六次，从下往上记录
   - 6为老阴（变爻），7为少阳，8为少阴，9为老阳（变爻）

2. 起卦原则：
   - 心诚则灵，问卦时要专心
   - 一事一卦，不可重复问同一件事
   - 问卦要具体，不可模糊

3. 解卦要点：
   - 先看卦象整体含义
   - 再看变爻的特殊意义
   - 结合问事的具体情况
   - 给出合理的建议

倪师强调，占卜是为了趋吉避凶，不是宿命论。
    `,
    category: 'iching',
    source: '倪海厦天纪教材',
    keywords: ['占卜方法', '投币法', '起卦', '解卦', '变爻']
  }
];

// 创建知识库
export function createKnowledgeBase(): KnowledgeBase {
  const allItems = [...ZIWEI_KNOWLEDGE, ...ICHING_KNOWLEDGE];
  
  return {
    items: allItems,
    categories: {
      ziwei: allItems.filter(item => item.category === 'ziwei'),
      iching: allItems.filter(item => item.category === 'iching'),
      general: allItems.filter(item => item.category === 'general')
    }
  };
}

// 搜索知识库（结合PDF和内置知识）
export function searchKnowledge(query: string, category?: 'ziwei' | 'iching' | 'general'): KnowledgeItem[] {
  // 搜索内置知识库
  const knowledgeBase = createKnowledgeBase();
  const items = category ? knowledgeBase.categories[category] : knowledgeBase.items;
  
  const queryLower = query.toLowerCase();
  
  const builtInResults = items.filter(item => 
    item.title.toLowerCase().includes(queryLower) ||
    item.content.toLowerCase().includes(queryLower) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(queryLower))
  );

  // 搜索PDF知识库
  const pdfResults = pdfParser.searchKnowledge(query, category);
  
  // 将PDF结果转换为KnowledgeItem格式
  const convertedPdfResults: KnowledgeItem[] = pdfResults.map(chunk => ({
    id: chunk.id,
    title: `PDF文档内容 - 第${chunk.page}页`,
    content: chunk.content,
    category: chunk.category,
    source: 'PDF文档',
    keywords: chunk.keywords
  }));

  // 合并结果
  return [...builtInResults, ...convertedPdfResults];
}

// 获取相关知识（结合PDF和内置知识）
export function getRelevantKnowledge(type: 'ziwei' | 'iching', keywords: string[]): KnowledgeItem[] {
  // 获取内置知识
  const knowledgeBase = createKnowledgeBase();
  const builtInItems = knowledgeBase.categories[type];
  
  const builtInResults = builtInItems.filter(item =>
    keywords.some(keyword =>
      item.keywords.some(itemKeyword =>
        itemKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  );

  // 获取PDF知识
  const pdfResults = pdfParser.searchKnowledge(keywords.join(' '), type);
  
  // 将PDF结果转换为KnowledgeItem格式
  const convertedPdfResults: KnowledgeItem[] = pdfResults.slice(0, 3).map(chunk => ({
    id: chunk.id,
    title: `PDF文档内容 - 第${chunk.page}页`,
    content: chunk.content,
    category: chunk.category,
    source: 'PDF文档',
    keywords: chunk.keywords
  }));

  // 合并结果，限制数量
  return [...builtInResults, ...convertedPdfResults].slice(0, 5);
}

// 增强AI提示词（结合PDF和内置知识）
export function enhancePromptWithKnowledge(
  basePrompt: string,
  type: 'ziwei' | 'iching',
  specificKeywords: string[] = []
): string {
  const relevantKnowledge = getRelevantKnowledge(type, specificKeywords);
  
  if (relevantKnowledge.length === 0) {
    return basePrompt;
  }
  
  const knowledgeContext = relevantKnowledge
    .slice(0, 3) // 限制最多3个知识点
    .map(item => `${item.title}：${item.content.trim()}`)
    .join('\n\n');
  
  return `${basePrompt}

参考倪海厦先生的理论：
${knowledgeContext}

请基于以上理论进行分析。`;
} 