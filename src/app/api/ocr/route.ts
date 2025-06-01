import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '请上传PDF文件' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: '只支持PDF文件格式' }, { status: 400 });
    }

    // 保存上传的文件到临时目录
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFileName = `temp_${Date.now()}_${file.name}`;
    const tempFilePath = join(process.cwd(), 'temp_files', tempFileName);
    
    await writeFile(tempFilePath, buffer);

    // 调用Python OCR脚本
    const result = await processOCR(tempFilePath, file.name);

    // 清理临时文件
    try {
      await unlink(tempFilePath);
    } catch (error) {
      console.error('清理临时文件失败:', error);
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('OCR处理错误:', error);
    return NextResponse.json(
      { error: '处理失败，请重试' }, 
      { status: 500 }
    );
  }
}

async function processOCR(filePath: string, fileName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // 使用conda环境中的Python
    const pythonScript = join(process.cwd(), 'ocr_processor.py');
    
    // 设置环境变量和使用conda环境
    const env = {
      ...process.env,
      PYTHONPATH: process.cwd(),
      // 如果有设置SILICONFLOW_API_KEY环境变量，传递给Python脚本
      SILICONFLOW_API_KEY: process.env.SILICONFLOW_API_KEY || process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY
    };

    // 使用conda环境中的Python
    const python = spawn('conda', ['run', '-n', 'pdf_ocr_env', 'python', pythonScript, filePath, fileName], {
      cwd: process.cwd(),
      env: env
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        try {
          // 尝试解析Python脚本返回的JSON结果
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (error) {
          // 如果不是JSON，返回文本结果
          resolve({
            success: true,
            content: stdout.trim(),
            fileName: fileName,
            processedAt: new Date().toISOString()
          });
        }
      } else {
        console.error('Python脚本stderr:', stderr);
        reject(new Error(`Python脚本执行失败 (exit code: ${code}): ${stderr}`));
      }
    });

    python.on('error', (error) => {
      reject(new Error(`执行Python脚本时出错: ${error.message}`));
    });
  });
} 