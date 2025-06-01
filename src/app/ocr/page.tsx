'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OCRPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('请选择PDF文件');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      alert('请先选择PDF文件');
      return;
    }

    setIsProcessing(true);
    try {
      // 这里将调用后端API进行OCR处理
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟处理时间
      setResult('OCR识别完成！这里将显示识别结果...');
    } catch (error) {
      console.error('处理失败:', error);
      alert('处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF OCR 识别
          </h1>
          <p className="text-lg text-gray-600">
            上传PDF文档，使用AI技术进行高精度OCR识别
          </p>
        </div>

        <div className="grid gap-8">
          {/* 文件上传区域 */}
          <Card>
            <CardHeader>
              <CardTitle>上传PDF文档</CardTitle>
              <CardDescription>
                支持倪海夏中医相关PDF文档的OCR识别
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="text-6xl text-gray-400">📄</div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      点击选择PDF文件
                    </p>
                    <p className="text-sm text-gray-500">
                      或拖拽文件到此区域
                    </p>
                  </div>
                </label>
              </div>
              
              {selectedFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    已选择: {selectedFile.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={handleProcess}
                  disabled={!selectedFile || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? '正在处理...' : '开始OCR识别'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 处理状态 */}
          {isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle>处理中...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-gray-900">正在进行OCR识别</p>
                    <p className="text-sm text-gray-600">
                      使用SiliconFlow API处理您的文档
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 结果显示 */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>识别结果</CardTitle>
                <CardDescription>
                  OCR识别完成，以下是提取的文本内容
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {result}
                  </pre>
                </div>
                <div className="mt-4 flex space-x-4">
                  <Button variant="outline">
                    下载JSON格式
                  </Button>
                  <Button variant="outline">
                    下载TXT格式
                  </Button>
                  <Button>
                    添加到知识库
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 