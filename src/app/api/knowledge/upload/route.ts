import { NextRequest, NextResponse } from 'next/server';
import { pdfParser } from '@/lib/knowledge/pdf-parser';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '请选择要上传的PDF文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: '只支持PDF文件格式' },
        { status: 400 }
      );
    }

    // 验证文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '文件大小不能超过10MB' },
        { status: 400 }
      );
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 保存文件
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    try {
      // 解析PDF文档
      const document = await pdfParser.parsePDF(filePath);
      
      // 添加到知识库
      pdfParser.addDocument(document);
      
      // 删除临时文件
      fs.unlinkSync(filePath);
      
      return NextResponse.json({
        success: true,
        document: {
          id: document.id,
          title: document.title,
          category: document.category,
          pages: document.pages,
          chunks: document.chunks.length,
          extractedAt: document.extractedAt
        },
        stats: pdfParser.getStats()
      });

    } catch (parseError) {
      // 删除临时文件
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      console.error('PDF解析错误:', parseError);
      return NextResponse.json(
        { error: 'PDF文件解析失败，请确保文件格式正确' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('文件上传错误:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = pdfParser.getStats();
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('获取知识库统计失败:', error);
    return NextResponse.json(
      { error: '获取知识库信息失败' },
      { status: 500 }
    );
  }
} 