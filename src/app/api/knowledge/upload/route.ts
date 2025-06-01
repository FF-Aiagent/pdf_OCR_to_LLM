import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 保存文件
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // 设置超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      // 调用 SiliconFlow API 进行 OCR
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
                    url: `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`
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
        throw new Error('OCR 识别失败');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // 删除临时文件
      fs.unlinkSync(filePath);

      return NextResponse.json({
        success: true,
        content,
        filename: file.name
      });

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }

  } catch (error) {
    console.error('OCR处理错误:', error);
    return NextResponse.json(
      { error: '文件处理失败，请重试' },
      { status: 500 }
    );
  }
}