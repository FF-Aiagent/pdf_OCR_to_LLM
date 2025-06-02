import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fetch from 'node-fetch';

// 从环境变量获取配置
const API_KEY = process.env.SILICONFLOW_API_KEY;
const API_BASE_URL = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
const MODEL = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-VL-72B-Instruct';
const API_TIMEOUT = 60000; // 增加到60秒超时

// 定义API响应类型
interface SiliconFlowResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    type?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 检查API密钥配置
    if (!API_KEY) {
      console.error('SILICONFLOW_API_KEY未配置');
      return NextResponse.json(
        { 
          success: false,
          error: '服务配置错误：API密钥未设置，请联系管理员' 
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false,
          error: '请选择要上传的PDF文件' 
        },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { 
          success: false,
          error: '只支持PDF文件格式' 
        },
        { status: 400 }
      );
    }

    // 验证文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { 
          success: false,
          error: '文件大小不能超过10MB' 
        },
        { status: 400 }
      );
    }

    console.log(`开始处理PDF文件: ${file.name}, 大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    // 读取PDF文件
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    console.log(`PDF共有 ${pageCount} 页`);
    
    let allContent = [];
    let successfulPages = 0;
    let failedPages = 0;

    // 处理每一页
    for (let pageNum = 0; pageNum < pageCount; pageNum++) {
      try {
        console.log(`处理第 ${pageNum + 1} 页...`);
        
        // 将PDF页面渲染为PNG
        const pdfPage = pdfDoc.getPages()[pageNum];
        
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
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.error(`第 ${pageNum + 1} 页请求超时`);
        }, API_TIMEOUT);

        try {
          const response = await fetch(`${API_BASE_URL}/chat/completions`, {
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
            const errorText = await response.text();
            console.error(`API响应错误 (${response.status}):`, errorText);
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
          }

          const data = await response.json() as SiliconFlowResponse;
          
          if (data.error) {
            console.error('API返回错误:', data.error);
            throw new Error(`API错误: ${data.error.message || '未知错误'}`);
          }

          const pageContent = data.choices?.[0]?.message?.content || '';
          if (pageContent.trim()) {
            allContent.push({
              page_number: pageNum + 1,
              content: pageContent.trim(),
              characters: pageContent.length
            });
            successfulPages++;
            console.log(`第 ${pageNum + 1} 页处理成功`);
          } else {
            console.warn(`第 ${pageNum + 1} 页未识别到内容`);
            allContent.push({
              page_number: pageNum + 1,
              content: '',
              characters: 0,
              error: true
            });
            failedPages++;
          }

        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          console.error(`第 ${pageNum + 1} 页网络请求失败:`, fetchError.message);
          
          allContent.push({
            page_number: pageNum + 1,
            content: '',
            characters: 0,
            error: true,
            error_message: fetchError.message
          });
          failedPages++;
        }

      } catch (error: any) {
        console.error(`处理第 ${pageNum + 1} 页时出错:`, error.message);
        allContent.push({
          page_number: pageNum + 1,
          content: '',
          characters: 0,
          error: true,
          error_message: error.message
        });
        failedPages++;
      }
    }

    // 生成完整内容
    const fullContent = allContent
      .filter(page => !page.error && page.content)
      .map(page => `=== 第${page.page_number}页 ===\n${page.content}`)
      .join('\n\n');

    const totalCharacters = allContent
      .filter(page => !page.error)
      .reduce((sum, page) => sum + page.characters, 0);

    console.log(`处理完成: 成功 ${successfulPages} 页, 失败 ${failedPages} 页`);

    return NextResponse.json({
      success: true,
      document_info: {
        filename: file.name,
        total_pages: pageCount,
        processed_date: new Date().toISOString(),
        model: MODEL
      },
      pages: allContent,
      full_content: fullContent,
      stats: {
        total_characters: totalCharacters,
        processing_time: Date.now(), // 这里可以改进为实际处理时间
        successful_pages: successfulPages,
        failed_pages: failedPages
      }
    });

  } catch (error: any) {
    console.error('OCR处理错误:', error);
    
    // 区分不同类型的错误
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { 
          success: false,
          error: '请求超时，请尝试较小的文件或稍后重试' 
        },
        { status: 408 }
      );
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          success: false,
          error: '网络连接错误，请检查网络连接后重试' 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: '文件处理失败，请重试。如果问题持续存在，请联系技术支持。',
        details: error.message
      },
      { status: 500 }
    );
  }
}