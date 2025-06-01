import fs from 'fs';
import path from 'path';

export interface KnowledgeItem {
  id: string;
  domain: string;
  subdomain: string;
  type: string;
  name: string;
  description: string;
  source: string;
  keywords: string[];
  related_concepts: string[];
  application_scenarios: string[];
  examples: string[];
  importance_level: number;
  confidence_level: number;
  content?: string;
}

export class NihaixiaKnowledgeManager {
  private knowledgeBase: KnowledgeItem[] = [];
  private knowledgeBasePath: string;

  constructor() {
    this.knowledgeBasePath = path.join(process.cwd(), 'nihaixia_knowledge_base');
    this.loadKnowledgeBase();
  }

  private loadKnowledgeBase(): void {
    try {
      // 加载倪海厦知识库文档
      const files = [
        'nihaixia_knowledge_structure.md',
        'nihaixia_core_knowledge_extracts.md',
        'nihaixia_knowledge_domains.md',
        'nihaixia_intro.md'
      ];

      files.forEach(filename => {
        const filePath = path.join(this.knowledgeBasePath, filename);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          this.parseAndAddKnowledge(content, filename);
        }
      });

      console.log(`倪海厦知识库加载完成，共 ${this.knowledgeBase.length} 个知识点`);
    } catch (error) {
      console.error('加载倪海厦知识库失败:', error);
    }
  }

  private parseAndAddKnowledge(content: string, source: string): void {
    // 解析Markdown内容，提取知识点
    const sections = content.split(/^##\s+/m);
    
    sections.forEach((section, index) => {
      if (index === 0) return; // 跳过文件头部
      
      const lines = section.split('\n');
      const title = lines[0]?.trim();
      if (!title) return;

      // 确定领域和子领域
      let domain = '未分类';
      let subdomain = '通用';
      
      if (title.includes('紫微斗数') || title.includes('命理')) {
        domain = '命理学';
        subdomain = '紫微斗数';
      } else if (title.includes('易经') || title.includes('占卜')) {
        domain = '占卜学';
        subdomain = '易经占卜';
      } else if (title.includes('风水') || title.includes('阳宅') || title.includes('阴宅')) {
        domain = '风水地理学';
        subdomain = '阳宅风水';
      } else if (title.includes('中医') || title.includes('经方') || title.includes('针灸')) {
        domain = '中医学';
        subdomain = '经方医学';
      }

      // 提取关键词
      const keywords = this.extractKeywords(section);
      
      // 创建知识项
      const knowledgeItem: KnowledgeItem = {
        id: `NH_${Date.now()}_${index}`,
        domain,
        subdomain,
        type: '理论',
        name: title,
        description: this.extractDescription(section),
        source: `倪海厦知识库 - ${source}`,
        keywords,
        related_concepts: this.extractRelatedConcepts(section),
        application_scenarios: this.extractApplications(section),
        examples: this.extractExamples(section),
        importance_level: 4,
        confidence_level: 5,
        content: section
      };

      this.knowledgeBase.push(knowledgeItem);
    });
  }

  private extractKeywords(content: string): string[] {
    const keywords: string[] = [];
    
    // 提取常见的倪海厦术语
    const commonTerms = [
      '紫微斗数', '命理', '易经', '占卜', '风水', '阳宅', '阴宅',
      '中医', '经方', '针灸', '本草', '内经', '天干地支', '阴阳五行',
      '八卦', '六十四卦', '三才', '命宫', '主星', '辅星', '四化',
      '大限', '流年', '三方四正', '星曜组合'
    ];

    commonTerms.forEach(term => {
      if (content.includes(term)) {
        keywords.push(term);
      }
    });

    return [...new Set(keywords)]; // 去重
  }

  private extractDescription(content: string): string {
    // 提取第一段作为描述
    const paragraphs = content.split('\n\n');
    for (const paragraph of paragraphs) {
      const cleaned = paragraph.replace(/[#*`-]/g, '').trim();
      if (cleaned.length > 20) {
        return cleaned.substring(0, 200) + (cleaned.length > 200 ? '...' : '');
      }
    }
    return '倪海厦理论知识点';
  }

  private extractRelatedConcepts(content: string): string[] {
    const concepts: string[] = [];
    const conceptTerms = [
      '命宫', '身宫', '主星', '辅星', '四化', '大限', '流年',
      '八卦', '六爻', '卦象', '爻辞', '阴阳', '五行',
      '经络', '穴位', '方剂', '药性'
    ];

    conceptTerms.forEach(term => {
      if (content.includes(term)) {
        concepts.push(term);
      }
    });

    return concepts;
  }

  private extractApplications(content: string): string[] {
    const applications = [
      '命运预测', '性格分析', '事业规划', '健康调理',
      '风水布局', '择日选时', '疾病诊断', '方药配伍'
    ];

    return applications.filter(app => 
      content.toLowerCase().includes(app) || 
      content.includes('应用') || 
      content.includes('实践')
    );
  }

  private extractExamples(content: string): string[] {
    const examples: string[] = [];
    
    // 查找示例相关的内容
    const examplePatterns = [
      /例如[：:](.*?)(?=\n|$)/g,
      /比如[：:](.*?)(?=\n|$)/g,
      /如[：:](.*?)(?=\n|$)/g
    ];

    examplePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const example = match.replace(/^(例如|比如|如)[：:]/, '').trim();
          if (example.length > 5) {
            examples.push(example);
          }
        });
      }
    });

    return examples;
  }

  // 搜索知识库
  public searchKnowledge(query: string, domain?: string): KnowledgeItem[] {
    const queryLower = query.toLowerCase();
    
    return this.knowledgeBase.filter(item => {
      // 领域过滤
      if (domain && item.domain !== domain) {
        return false;
      }

      // 关键词匹配
      const matchesKeywords = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(queryLower) ||
        queryLower.includes(keyword.toLowerCase())
      );

      // 标题匹配
      const matchesTitle = item.name.toLowerCase().includes(queryLower);

      // 描述匹配
      const matchesDescription = item.description.toLowerCase().includes(queryLower);

      // 内容匹配
      const matchesContent = item.content?.toLowerCase().includes(queryLower);

      return matchesKeywords || matchesTitle || matchesDescription || matchesContent;
    }).sort((a, b) => {
      // 按重要性和相关性排序
      const aScore = this.calculateRelevanceScore(a, queryLower);
      const bScore = this.calculateRelevanceScore(b, queryLower);
      return bScore - aScore;
    });
  }

  private calculateRelevanceScore(item: KnowledgeItem, query: string): number {
    let score = 0;

    // 标题匹配得分最高
    if (item.name.toLowerCase().includes(query)) {
      score += 10;
    }

    // 关键词匹配
    item.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase())) {
        score += 5;
      }
    });

    // 描述匹配
    if (item.description.toLowerCase().includes(query)) {
      score += 3;
    }

    // 重要性加权
    score += item.importance_level;

    return score;
  }

  // 获取所有领域
  public getDomains(): string[] {
    const domains = [...new Set(this.knowledgeBase.map(item => item.domain))];
    return domains.sort();
  }

  // 获取指定领域的子领域
  public getSubdomains(domain: string): string[] {
    const subdomains = [...new Set(
      this.knowledgeBase
        .filter(item => item.domain === domain)
        .map(item => item.subdomain)
    )];
    return subdomains.sort();
  }

  // 获取知识库统计信息
  public getStatistics() {
    const domains = this.getDomains();
    const stats = {
      total: this.knowledgeBase.length,
      domains: domains.length,
      byDomain: {} as Record<string, number>
    };

    domains.forEach(domain => {
      stats.byDomain[domain] = this.knowledgeBase.filter(item => item.domain === domain).length;
    });

    return stats;
  }

  // 获取推荐知识点
  public getRecommendations(currentItem: KnowledgeItem, limit: number = 5): KnowledgeItem[] {
    return this.knowledgeBase
      .filter(item => 
        item.id !== currentItem.id && 
        (item.domain === currentItem.domain || 
         item.keywords.some(keyword => currentItem.keywords.includes(keyword)))
      )
      .sort((a, b) => b.importance_level - a.importance_level)
      .slice(0, limit);
  }
}

// 创建单例实例
export const nihaixiaKnowledgeManager = new NihaixiaKnowledgeManager(); 