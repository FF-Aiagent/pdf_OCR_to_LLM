import { NextRequest, NextResponse } from 'next/server';
import { nihaixiaKnowledgeManager } from '@/lib/knowledge/NihaixiaKnowledgeManager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const domain = searchParams.get('domain') || undefined;
    const action = searchParams.get('action') || 'search';

    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 });
        }
        
        const results = nihaixiaKnowledgeManager.searchKnowledge(query, domain);
        return NextResponse.json({
          success: true,
          query,
          domain,
          results: results.slice(0, 10), // 限制返回结果数量
          total: results.length
        });

      case 'domains':
        const domains = nihaixiaKnowledgeManager.getDomains();
        return NextResponse.json({
          success: true,
          domains
        });

      case 'subdomains':
        if (!domain) {
          return NextResponse.json({ error: '请提供领域参数' }, { status: 400 });
        }
        
        const subdomains = nihaixiaKnowledgeManager.getSubdomains(domain);
        return NextResponse.json({
          success: true,
          domain,
          subdomains
        });

      case 'stats':
        const stats = nihaixiaKnowledgeManager.getStatistics();
        return NextResponse.json({
          success: true,
          statistics: stats
        });

      default:
        return NextResponse.json({ error: '不支持的操作' }, { status: 400 });
    }

  } catch (error) {
    console.error('倪海厦知识库API错误:', error);
    return NextResponse.json(
      { error: '知识库查询失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, domain, limit = 5 } = body;

    if (!query) {
      return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 });
    }

    const results = nihaixiaKnowledgeManager.searchKnowledge(query, domain);
    
    return NextResponse.json({
      success: true,
      query,
      domain,
      results: results.slice(0, limit),
      total: results.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('倪海厦知识库POST API错误:', error);
    return NextResponse.json(
      { error: '知识库查询失败' },
      { status: 500 }
    );
  }
} 