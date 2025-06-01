import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fromPath } from 'pdf2pic';
import FormData from 'form-data';
import fetch from 'node-fetch';

const API_KEY = "sk-qnczgrftmuzuyhyfdroapmqqqnefqpvbwtjikrnlbzbimpkw";
const MODEL = "Qwen/Qwen2.5-VL-72B-Instruct";
const API_TIMEOUT = 30000; // 30 seconds timeout

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
    const tempImagesDir = path.join(process.cwd(), 'temp_images');
    
    [uploadDir, tempImagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // 保存PDF文件
    const pdfFileName = `${Date.now()}_${file.name}`;
    const pdfPath = path.join(uploadDir, pdfFileName);
    
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(pdfPath, Buffer.from(buffer));

    // 配置PDF到图片的转换
    const options = {
      density: 300,
      saveFilename: "page",
      savePath: tempImagesDir,
      format: "png",
      width: 2048,
      height: 2048
    };

    const convert = fromPath(pdfPath, options);
    
    // 获取PDF页数
    const pageCount = await convert.bulk(-1, true);
    
    let allContent = [];

    // 处理每一页
    for (let pageNum = 1; pageNum <= pageCount.length; pageNum++) {
      const imagePath = path.join(tempImagesDir, `page${pageNum}.png`);
      
      if (!fs.existsSync(imagePath)) {
        console.warn(`Page ${pageNum} image not found`);
        continue;
      }

      // 设置超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');

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
          throw new Error(`页面 ${pageNum} OCR识别失败`);
        }

        const data = await response.json();
        const pageContent = data.choices[0]?.message?.content || '';
        allContent.push(`--- 第${pageNum}页 ---\n${pageContent}`);

        // 删除处理完的图片
        fs.unlinkSync(imagePath);

      } catch (error) {
        clearTimeout(timeoutId);
        console.error(`处理第${pageNum}页时出错:`, error);
        throw error;
      }
    }

    // 清理临时文件
    fs.unlinkSync(pdfPath);
    if (fs.existsSync(tempImagesDir)) {
      fs.rmSync(tempImagesDir, { recursive: true, force: true });
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