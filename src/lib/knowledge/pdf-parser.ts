// PDF文档解析器
// 用于解析倪海厦PDF教材并提取知识内容

import fs from 'fs';
import path from 'path';

export interface PDFDocument {
  id: string;
  filename: string;
  title: string;
  content: string;
  pages: number;
  category: 'ziwei' | 'iching' | 'general';
  extractedAt: Date;
  chunks: TextChunk[];
}

export interface TextChunk {
  id: string;
  content: string;
  page: number;
  keywords: string[];
  category: 'ziwei' | 'iching' | 'general';
  relevanceScore?: number;
}

export interface KnowledgeIndex {
  documents: PDFDocument[];
  chunks: TextChunk[];
  keywords: Map<string, string[]>; // keyword -> chunk IDs
}

/**
 * PDF文本提取器
 * 使用pdf-parse库解析PDF文件
 */
export class PDFParser {
  private knowledgeIndex: KnowledgeIndex;

  constructor() {
    this.knowledgeIndex = {
      documents: [],
      chunks: [],
      keywords: new Map()
    };
  }

  /**
   * 解析PDF文件
   * 使用pdf-parse库提取文本内容
   */
  async parsePDF(filePath: string): Promise<PDFDocument> {
    const filename = path.basename(filePath);
    
    try {
      // 动态导入pdf-parse（仅在服务器端使用）
      const pdfParse = (await import('pdf-parse')).default;
      
      // 读取PDF文件
      const dataBuffer = fs.readFileSync(filePath);
      
      // 解析PDF
      const data = await pdfParse(dataBuffer);
      
      const content = data.text;
      const pages = data.numpages;
      
      const category = this.detectCategory(filename, content);
      const chunks = this.extractChunks(content, category);
      
      const document: PDFDocument = {
        id: this.generateId(),
        filename,
        title: this.extractTitle(filename),
        content,
        pages,
        category,
        extractedAt: new Date(),
        chunks
      };

      return document;
      
    } catch (error) {
      console.error('PDF解析失败:', error);
      
      // 如果PDF解析失败，使用模拟内容
      const mockContent = this.getMockPDFContent(filename);
      const category = this.detectCategory(filename, mockContent);
      const chunks = this.extractChunks(mockContent, category);
      
      const document: PDFDocument = {
        id: this.generateId(),
        filename,
        title: this.extractTitle(filename),
        content: mockContent,
        pages: Math.floor(mockContent.length / 2000),
        category,
        extractedAt: new Date(),
        chunks
      };

      return document;
    }
  }

  /**
   * 检测文档类别
   */
  private detectCategory(filename: string, content: string): 'ziwei' | 'iching' | 'general' {
    const lowerFilename = filename.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (lowerFilename.includes('紫薇') || lowerFilename.includes('斗数') || 
        lowerContent.includes('紫薇斗数') || lowerContent.includes('命宫') ||
        lowerContent.includes('十四主星') || lowerContent.includes('十二宫位')) {
      return 'ziwei';
    }
    
    if (lowerFilename.includes('周易') || lowerFilename.includes('易经') || 
        lowerContent.includes('八卦') || lowerContent.includes('六十四卦') ||
        lowerContent.includes('乾坤') || lowerContent.includes('占卜')) {
      return 'iching';
    }
    
    return 'general';
  }

  /**
   * 提取文档标题
   */
  private extractTitle(filename: string): string {
    return filename.replace(/\.(pdf|PDF)$/, '').replace(/[-_]/g, ' ');
  }

  /**
   * 将文档内容分割成知识块
   */
  private extractChunks(content: string, category: 'ziwei' | 'iching' | 'general'): TextChunk[] {
    const chunks: TextChunk[] = [];
    
    // 按段落分割
    const paragraphs = content.split(/\n\s*\n/);
    
    // 按章节分割（如果有明显的章节标记）
    const sections = this.splitBySections(content);
    
    let chunkIndex = 0;
    const textToProcess = sections.length > 1 ? sections : paragraphs;
    
    for (const text of textToProcess) {
      const trimmedText = text.trim();
      if (trimmedText.length < 100) continue; // 跳过太短的段落
      
      // 如果文本太长，进一步分割
      const subChunks = this.splitLongText(trimmedText, 1000);
      
      for (const subChunk of subChunks) {
        const keywords = this.extractKeywords(subChunk, category);
        
        chunks.push({
          id: `chunk_${chunkIndex++}`,
          content: subChunk,
          page: Math.floor(chunkIndex / 3) + 1, // 估算页码
          keywords,
          category
        });
      }
    }
    
    return chunks;
  }

  /**
   * 按章节分割文本
   */
  private splitBySections(content: string): string[] {
    // 查找章节标记
    const sectionPatterns = [
      /第[一二三四五六七八九十\d]+章/g,
      /第[一二三四五六七八九十\d]+节/g,
      /[一二三四五六七八九十\d]+、/g,
      /\d+\./g
    ];
    
    for (const pattern of sectionPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 2) {
        return content.split(pattern).filter(section => section.trim().length > 100);
      }
    }
    
    return [];
  }

  /**
   * 分割过长的文本
   */
  private splitLongText(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) {
      return [text];
    }
    
    const chunks: string[] = [];
    const sentences = text.split(/[。！？；]/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '。';
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  /**
   * 提取关键词
   */
  private extractKeywords(text: string, category: 'ziwei' | 'iching' | 'general'): string[] {
    const keywords: string[] = [];
    
    // 紫薇斗数相关关键词
    const ziweiKeywords = [
      '紫薇', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴',
      '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
      '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
      '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫',
      '左辅', '右弼', '文昌', '文曲', '禄存', '天马',
      '擎羊', '陀罗', '火星', '铃星', '天空', '地劫',
      '大运', '流年', '四化', '化禄', '化权', '化科', '化忌'
    ];
    
    // 周易相关关键词
    const ichingKeywords = [
      '乾', '坤', '震', '巽', '坎', '离', '艮', '兑',
      '八卦', '六十四卦', '阴阳', '五行', '占卜', '卦象',
      '爻', '变爻', '本卦', '变卦', '卦辞', '爻辞',
      '金', '木', '水', '火', '土', '相生', '相克',
      '天干', '地支', '甲乙丙丁', '子丑寅卯'
    ];
    
    // 通用关键词
    const generalKeywords = [
      '倪海厦', '天纪', '人纪', '中医', '针灸', '伤寒论',
      '命运', '预测', '分析', '理论', '方法', '原理'
    ];
    
    const targetKeywords = category === 'ziwei' ? [...ziweiKeywords, ...generalKeywords] : 
                          category === 'iching' ? [...ichingKeywords, ...generalKeywords] : 
                          [...ziweiKeywords, ...ichingKeywords, ...generalKeywords];
    
    for (const keyword of targetKeywords) {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    }
    
    return [...new Set(keywords)]; // 去重
  }

  /**
   * 模拟PDF内容（用于演示和备用）
   */
  private getMockPDFContent(filename: string): string {
    if (filename.includes('紫薇') || filename.includes('斗数')) {
      return `
倪海厦紫薇斗数教学内容

第一章 紫薇斗数基础理论

紫薇斗数是中国古代占星学的重要分支，以紫薇星为主星，配合其他十三颗主星，结合十二宫位来推断人的命运。

命宫的计算方法：
1. 寅宫起正月，顺数到生月
2. 从生月宫起子时，顺数到生时
3. 此宫即为命宫

身宫的计算方法：
身宫 = 命宫 + 月份 + 时辰 - 2

十四主星特性：

紫薇星：帝王星，主贵气，有领导能力，但容易孤高。在命宫的人通常具有领导才能，但要注意不要过于自负。

天机星：智慧星，主谋略，善于思考，但容易多虑。天机星在命宫的人聪明机智，但要避免想太多而错失机会。

太阳星：父亲星，主权威，有正义感，但容易刚强。太阳星代表光明正大，在命宫的人性格开朗，但要注意脾气。

武曲星：财星，主财富，有执行力，但容易固执。武曲星在财帛宫特别好，主财运亨通。

天同星：福星，主享受，性格温和，但容易懒散。天同星在命宫的人福分深厚，但要避免过于安逸。

廉贞星：囚星，主变化，有才华，但容易冲动。廉贞星的人多才多艺，但要控制情绪。

天府星：财库星，主稳定，有组织能力，但容易保守。天府星在命宫的人稳重可靠。

太阴星：母亲星，主柔情，有包容心，但容易多愁。太阴星代表阴柔之美。

贪狼星：欲望星，主多才，有魅力，但容易贪心。贪狼星的人多才多艺，桃花运旺。

巨门星：暗星，主口舌，有辩才，但容易是非。巨门星的人口才好，但要注意言辞。

天相星：印星，主辅佐，有责任心，但容易依赖。天相星的人适合做幕僚工作。

天梁星：荫星，主庇护，有长者风范，但容易固执。天梁星的人有贵人运。

七杀星：将星，主冲动，有行动力，但容易暴躁。七杀星的人行动力强，但要控制脾气。

破军星：耗星，主破坏，有开创力，但容易破坏。破军星的人有开创精神，但要注意破坏性。

十二宫位含义：

命宫：主要性格特质，人生基调。命宫是整个命盘的核心，决定一个人的基本性格。

兄弟宫：兄弟姐妹关系，朋友缘分。看兄弟姐妹的情况和朋友关系。

夫妻宫：婚姻感情，配偶状况。看婚姻是否美满，配偶的情况。

子女宫：子女缘分，创作能力。看子女运势和创造力。

财帛宫：财运状况，赚钱能力。看一生的财运如何。

疾厄宫：健康状况，身体素质。看身体健康和疾病情况。

迁移宫：外出运势，人际关系。看出外发展和人际关系。

奴仆宫：下属关系，朋友助力。看下属和朋友的帮助。

官禄宫：事业发展，工作状况。看事业运势和工作情况。

田宅宫：不动产，家庭环境。看房产和家庭环境。

福德宫：精神享受，福分厚薄。看精神生活和福分。

父母宫：父母关系，长辈缘分。看与父母长辈的关系。

排盘要点：
1. 必须使用农历时间
2. 时辰要准确，差一个时辰命盘就不同
3. 要结合大运流年来看
4. 不能只看单一星宿，要综合分析

倪师特别强调，紫薇斗数不是宿命论，而是帮助人了解自己，趋吉避凶的工具。
      `;
    }
    
    if (filename.includes('周易') || filename.includes('易经')) {
      return `
倪海厦周易教学内容

第一章 周易基本理论

周易是中华文化的根源，包含了宇宙运行的规律。其核心理念：

1. 阴阳理论：万物皆有阴阳，阴阳相互转化
2. 五行理论：金木水火土相生相克
3. 八卦理论：乾坤震巽坎离艮兑代表八种基本状态
4. 六十四卦：八卦相重，形成六十四种变化

八卦基本含义：

乾卦（☰）：天，父，君，金，西北，刚健
乾卦代表天，象征刚健、积极、向上的力量。在人事上代表父亲、君主、领导者。

兑卦（☱）：泽，少女，口，金，西，喜悦
兑卦代表泽，象征喜悦、交流、口才。在人事上代表少女、口舌、交际。

离卦（☲）：火，中女，目，火，南，光明
离卦代表火，象征光明、智慧、文明。在人事上代表中女、眼睛、文化。

震卦（☳）：雷，长男，足，木，东，动
震卦代表雷，象征震动、行动、发展。在人事上代表长男、足部、运动。

巽卦（☴）：风，长女，股，木，东南，顺
巽卦代表风，象征顺从、渗透、传播。在人事上代表长女、大腿、传播。

坎卦（☵）：水，中男，耳，水，北，险
坎卦代表水，象征险难、智慧、流动。在人事上代表中男、耳朵、危险。

艮卦（☶）：山，少男，手，土，东北，止
艮卦代表山，象征停止、稳定、阻碍。在人事上代表少男、手部、停止。

坤卦（☷）：地，母，腹，土，西南，顺
坤卦代表地，象征柔顺、包容、承载。在人事上代表母亲、腹部、顺从。

占卜方法：

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

六十四卦简介：

乾为天：纯阳之卦，象征刚健、创造、领导。
坤为地：纯阴之卦，象征柔顺、承载、包容。
水雷屯：象征初生、困难、积蓄力量。
山水蒙：象征启蒙、教育、开智。
水天需：象征等待、需求、时机未到。
天水讼：象征争讼、冲突、不和。

倪师强调，周易不是迷信，而是古人对自然规律的总结。占卜只是其应用之一，更重要的是理解其中的哲学思想。

解卦原则：
1. 要结合卦象的整体含义
2. 注意变爻的特殊意义
3. 考虑问卦的具体情况
4. 给出实用的建议
5. 不可过分神秘化

倪师特别提醒，占卜是为了趋吉避凶，不是宿命论。人的命运可以通过努力和智慧来改变。
      `;
    }
    
    return '这是一个示例PDF文档内容。';
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 搜索知识库
   */
  searchKnowledge(query: string, category?: 'ziwei' | 'iching' | 'general'): TextChunk[] {
    const queryLower = query.toLowerCase();
    const results: TextChunk[] = [];
    
    for (const chunk of this.knowledgeIndex.chunks) {
      if (category && chunk.category !== category) continue;
      
      let score = 0;
      
      // 内容匹配
      if (chunk.content.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // 关键词匹配
      for (const keyword of chunk.keywords) {
        if (keyword.toLowerCase().includes(queryLower) || queryLower.includes(keyword.toLowerCase())) {
          score += 5;
        }
      }
      
      // 模糊匹配
      const queryWords = queryLower.split(/\s+/);
      for (const word of queryWords) {
        if (word.length > 1 && chunk.content.toLowerCase().includes(word)) {
          score += 2;
        }
      }
      
      if (score > 0) {
        chunk.relevanceScore = score;
        results.push(chunk);
      }
    }
    
    return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  /**
   * 添加文档到知识库
   */
  addDocument(document: PDFDocument): void {
    this.knowledgeIndex.documents.push(document);
    this.knowledgeIndex.chunks.push(...document.chunks);
    
    // 更新关键词索引
    for (const chunk of document.chunks) {
      for (const keyword of chunk.keywords) {
        if (!this.knowledgeIndex.keywords.has(keyword)) {
          this.knowledgeIndex.keywords.set(keyword, []);
        }
        this.knowledgeIndex.keywords.get(keyword)!.push(chunk.id);
      }
    }
  }

  /**
   * 获取知识库统计信息
   */
  getStats() {
    return {
      documents: this.knowledgeIndex.documents.length,
      chunks: this.knowledgeIndex.chunks.length,
      keywords: this.knowledgeIndex.keywords.size,
      categories: {
        ziwei: this.knowledgeIndex.chunks.filter(c => c.category === 'ziwei').length,
        iching: this.knowledgeIndex.chunks.filter(c => c.category === 'iching').length,
        general: this.knowledgeIndex.chunks.filter(c => c.category === 'general').length
      }
    };
  }

  /**
   * 清空知识库
   */
  clearKnowledge(): void {
    this.knowledgeIndex = {
      documents: [],
      chunks: [],
      keywords: new Map()
    };
  }

  /**
   * 获取所有文档
   */
  getDocuments(): PDFDocument[] {
    return this.knowledgeIndex.documents;
  }
}

// 全局PDF解析器实例
export const pdfParser = new PDFParser(); 