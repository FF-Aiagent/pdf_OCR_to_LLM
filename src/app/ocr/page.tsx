'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface OCRResult {
  success: boolean;
  document_info?: {
    filename: string;
    total_pages: number;
    processed_date: string;
    model: string;
  };
  pages?: Array<{
    page_number: number;
    content: string;
    characters: number;
    error?: boolean;
  }>;
  full_content?: string;
  stats?: {
    total_characters: number;
    processing_time: number;
    successful_pages?: number;
    failed_pages?: number;
  };
  error?: string;
}

export default function OCRPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processProgress, setProcessProgress] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setResult(null); // 清除之前的结果
      setProcessProgress('');
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
    setProcessProgress('开始上传文件...');
    
    try {
      // 创建FormData来上传文件
      const formData = new FormData();
      formData.append('file', selectedFile);

      setProcessProgress('正在调用OCR服务，请耐心等待...');

      // 调用API
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const data: OCRResult = await response.json();

      if (response.ok && data.success) {
        setResult(data);
        setProcessProgress('处理完成！');
      } else {
        setProcessProgress('');
        alert(data.error || '处理失败，请重试');
      }
    } catch (error) {
      console.error('OCR处理失败:', error);
      setProcessProgress('');
      alert('网络错误，请检查连接后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.document_info?.filename || 'ocr_result'}_knowledge_base.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadTXT = () => {
    if (!result || !result.full_content) return;
    
    const txtContent = `${result.document_info?.filename || 'OCR结果'} - AI知识库
处理时间: ${result.document_info?.processed_date || new Date().toISOString()}
总字符数: ${result.stats?.total_characters || 0}
总页数: ${result.document_info?.total_pages || 0}
成功页数: ${result.stats?.successful_pages || 0}
失败页数: ${result.stats?.failed_pages || 0}
处理用时: ${result.stats?.processing_time || 0}秒
模型: ${result.document_info?.model || 'N/A'}

${'='.repeat(80)}

${result.full_content}`;

    const dataBlob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.document_info?.filename || 'ocr_result'}_content.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
                支持倪海厦中医相关PDF文档的OCR识别
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
                      {processProgress || '使用SiliconFlow API处理您的文档，请稍候...'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ⚠️ 多页文档处理时间较长，每页间隔3秒避免API限制，请耐心等待
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 结果显示 */}
          {result && result.success && (
            <Card>
              <CardHeader>
                <CardTitle>识别结果</CardTitle>
                <CardDescription>
                  OCR识别完成，以下是提取的文本内容
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 统计信息 */}
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="font-medium">总页数：</span>
                      {result.document_info?.total_pages || 0}
                    </div>
                    <div>
                      <span className="font-medium">成功页数：</span>
                      <span className="text-green-600">{result.stats?.successful_pages || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">失败页数：</span>
                      <span className="text-red-600">{result.stats?.failed_pages || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">总字符：</span>
                      {result.stats?.total_characters || 0}
                    </div>
                    <div>
                      <span className="font-medium">处理用时：</span>
                      {result.stats?.processing_time?.toFixed(1) || 0}秒
                    </div>
                    <div>
                      <span className="font-medium">模型：</span>
                      {result.document_info?.model?.split('/').pop() || 'N/A'}
                    </div>
                  </div>
                  
                  {/* 处理质量评估 */}
                  {result.document_info && result.stats && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="text-sm">
                        <span className="font-medium">处理质量：</span>
                        {(() => {
                          const total = result.document_info!.total_pages;
                          const success = result.stats!.successful_pages || 0;
                          const rate = total > 0 ? (success / total * 100) : 0;
                          if (rate === 100) return <span className="text-green-600 font-medium">完美 (100%)</span>;
                          if (rate >= 90) return <span className="text-green-600">优秀 ({rate.toFixed(1)}%)</span>;
                          if (rate >= 70) return <span className="text-yellow-600">良好 ({rate.toFixed(1)}%)</span>;
                          return <span className="text-red-600">需要重试 ({rate.toFixed(1)}%)</span>;
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* 页面内容预览 */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">内容预览：</h4>
                  <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">
                      {result.full_content?.substring(0, 2000)}
                      {result.full_content && result.full_content.length > 2000 && '...\n\n[内容过长，已截断，完整内容请下载文件查看]'}
                    </pre>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={downloadJSON}>
                    📄 下载JSON格式
                  </Button>
                  <Button variant="outline" onClick={downloadTXT}>
                    📝 下载TXT格式
                  </Button>
                  <Button>
                    🗂️ 添加到知识库
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 错误显示 */}
          {result && !result.success && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">处理失败</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800">{result.error}</p>
                  <div className="mt-2 text-sm text-red-600">
                    <p>可能的原因：</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>PDF文件损坏或格式不支持</li>
                      <li>API密钥无效或已过期</li>
                      <li>网络连接问题</li>
                      <li>服务器处理超时</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 