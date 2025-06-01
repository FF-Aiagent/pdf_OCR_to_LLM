'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OCRPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setResult(null);
      setError(null);
    } else {
      setError('请选择PDF文件');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('请先选择PDF文件');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResult(data.content);
        } else {
          throw new Error(data.error || '处理失败');
        }
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('处理失败:', error);
      setError(error instanceof Error ? error.message : '处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (format: 'json' | 'txt') => {
    if (!result) return;

    try {
      const response = await fetch(`/api/knowledge/download?format=${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: result })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `OCR结果_${new Date().toISOString()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('下载失败');
      }
    } catch (error) {
      console.error('下载失败:', error);
      setError('下载失败，请重试');
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
                  disabled={isProcessing}
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

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <div>
                      <p className="text-gray-900">正在进行OCR识别</p>
                      <p className="text-sm text-gray-600">
                        使用SiliconFlow API处理您的文档
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    已完成 {progress}%
                  </p>
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
                <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {result}
                  </pre>
                </div>
                <div className="mt-4 flex space-x-4">
                  <Button variant="outline" onClick={() => handleDownload('json')}>
                    下载JSON格式
                  </Button>
                  <Button variant="outline" onClick={() => handleDownload('txt')}>
                    下载TXT格式
                  </Button>
                  <Button onClick={() => {
                    // 添加到知识库
                    fetch('/api/knowledge/add', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        content: result,
                        filename: selectedFile?.name
                      })
                    }).then(response => {
                      if (response.ok) {
                        alert('成功添加到知识库');
                      } else {
                        throw new Error('添加失败');
                      }
                    }).catch(error => {
                      console.error('添加失败:', error);
                      setError('添加到知识库失败，请重试');
                    });
                  }}>
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