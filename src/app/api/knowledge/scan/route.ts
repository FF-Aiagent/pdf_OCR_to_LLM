import { NextRequest, NextResponse } from 'next/server';
import { localScanner } from '@/lib/knowledge/local-scanner';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = 'scan' } = body;

    if (action === 'rescan') {
      // 重新扫描（清空现有知识库）
      const result = await localScanner.rescanKnowledge();
      
      return NextResponse.json({
        success: result.success,
        message: result.success ? '重新扫描完成' : '扫描失败',
        result
      });
    } else {
      // 普通扫描（不清空现有知识库）
      const result = await localScanner.scanLocalKnowledge();
      
      return NextResponse.json({
        success: result.success,
        message: result.success ? '扫描完成' : '扫描失败',
        result
      });
    }

  } catch (error) {
    console.error('扫描API错误:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '扫描失败' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 获取知识库目录信息
    const info = localScanner.getKnowledgeDataInfo();
    const isLoaded = localScanner.isKnowledgeLoaded();
    
    return NextResponse.json({
      success: true,
      info,
      isLoaded
    });
  } catch (error) {
    console.error('获取知识库信息错误:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '获取信息失败' 
      },
      { status: 500 }
    );
  }
} 