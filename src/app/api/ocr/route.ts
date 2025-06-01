import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import FormData from 'form-data';
import fetch from 'node-fetch';

const API_KEY = "sk-qnczgrftmuzuyhyfdroapmqqqnefqpvbwtjikrnlbzbimpkw";
const MODEL = "Qwen/Qwen2.5-VL-72B-Instruct";
const API_TIMEOUT = 30000; // 30 seconds timeout

// 定义API响应类型
interface SiliconFlowResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

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

    // 读取PDF文件
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    let allContent = [];

    // 处理每一页
    for (let pageNum = 0; pageNum < pageCount; pageNum++) {
      try {
        // 将PDF页面渲染为PNG
        const pdfPage = pdfDoc.getPages()[pageNum];
        const { width, height } = pdfPage.getSize();
        
        // 创建一个新的PDF文档，只包含当前页面
        const singlePagePdf = await PDFDocument.create();
        const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [pageNum]);
        singlePagePdf.addPage(copiedPage);
        
        // 将单页PDF转换为PNG格式
        const pngBytes = await singlePagePdf.saveAsBase64();
        const pngBuffer = Buffer.from(pngBytes, 'base64');
        
        // 使用sharp处理图像
        const image = await sharp(pngBuffer)
          .png()
          .resize(2048, 2048, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toBuffer();
        
        const imageBase64 = image.toString('base64');

        // 设置超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: '请识别图片中的所有中文文字内容，完整准确地提取出来，保持原有的格式和结构。'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/png;base64,${imageBase64}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 4000,
            temperature: 0.1
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`页面 ${pageNum + 1} OCR识别失败`);
        }

        const data = await response.json() as SiliconFlowResponse;
        const pageContent = data.choices?.[0]?.message?.content || '';
        allContent.push(`--- 第${pageNum + 1}页 ---\n${pageContent}`);

      } catch (error) {
        console.error(`处理第${pageNum + 1}页时出错:`, error);
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      content: allContent.join('\n\n'),
      filename: file.name
    });

  } catch (error) {
    console.error('OCR处理错误:', error);
    return NextResponse.json(
      { error: '文件处理失败，请重试' },
      { status: 500 }
    );
  }
}