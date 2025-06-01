'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function BatchPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(62);
  const [processingLog, setProcessingLog] = useState<string[]>([]);

  const startBatchProcessing = async () => {
    setIsProcessing(true);
    setProcessedCount(0);
    setProcessingLog(['开始批量处理 PDF 文档...']);

    // 模拟批量处理过程
    for (let i = 0; i < totalCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)); // 模拟处理时间
      setProcessedCount(i + 1);
      
      if (i % 5 === 0) {
        setProcessingLog(prev => [...prev, `正在处理第 ${i + 1} 个文档...`]);
      }
    }

    setProcessingLog(prev => [...prev, '批量处理完成！']);
    setIsProcessing(false);
  };

  const progressPercentage = Math.round((processedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            批量 PDF 处理
          </h1>
          <p className="text-lg text-gray-600">
            一键处理整个知识库目录中的所有PDF文档
          </p>
        </div>

        <div className="grid gap-8">
          {/* 批处理状态 */}
          <Card>
            <CardHeader>
              <CardTitle>处理状态</CardTitle>
              <CardDescription>
                监控批量OCR处理的实时进度
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 进度条 */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>处理进度</span>
                    <span>{processedCount} / {totalCount} ({progressPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                    <div className="text-sm text-gray-600">待处理文档</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{processedCount}</div>
                    <div className="text-sm text-gray-600">已完成</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{totalCount - processedCount}</div>
                    <div className="text-sm text-gray-600">剩余文档</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {isProcessing ? Math.round((totalCount - processedCount) * 0.5) : 0}
                    </div>
                    <div className="text-sm text-gray-600">预计剩余(分钟)</div>
                  </div>
                </div>

                {/* 控制按钮 */}
                <div className="flex justify-center">
                  <Button
                    onClick={startBatchProcessing}
                    disabled={isProcessing}
                    className="px-8 py-3"
                  >
                    {isProcessing ? '正在处理中...' : '开始批量处理'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 处理配置 */}
          <Card>
            <CardHeader>
              <CardTitle>处理配置</CardTitle>
              <CardDescription>
                批量处理的配置选项和输出设置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">源目录</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>📁 knowledge_data/</div>
                    <div className="ml-4">📁 【01】《天纪》教材电子档/</div>
                    <div className="ml-4">📁 【02】《人纪》教材电子档/</div>
                    <div className="ml-4">📁 【04】《天纪》《人纪》原版影印版文档/</div>
                    <div className="ml-4">📁 【07 新增】视频文字实录/</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">输出设置</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>✅ 按文档分类存储</div>
                    <div>✅ 生成JSON格式</div>
                    <div>✅ 生成TXT格式</div>
                    <div>✅ 自动分类标签</div>
                    <div>✅ 处理日志记录</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 处理日志 */}
          <Card>
            <CardHeader>
              <CardTitle>处理日志</CardTitle>
              <CardDescription>
                实时显示批量处理的详细日志信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                {processingLog.length === 0 ? (
                  <div className="text-gray-500">等待开始批量处理...</div>
                ) : (
                  processingLog.map((log, index) => (
                    <div key={index} className="mb-1">
                      [{new Date().toLocaleTimeString()}] {log}
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="animate-pulse">
                    [{new Date().toLocaleTimeString()}] 处理中...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 处理结果 */}
          {processedCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>处理结果</CardTitle>
                <CardDescription>
                  批量处理完成后的结果统计
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{processedCount}</div>
                    <div className="text-sm text-gray-600">成功处理</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {Math.round(processedCount * 8.5)}KB
                    </div>
                    <div className="text-sm text-gray-600">知识库大小</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-xl font-bold text-purple-600">98.5%</div>
                    <div className="text-sm text-gray-600">平均准确率</div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center space-x-4">
                  <Button variant="outline">
                    查看知识库
                  </Button>
                  <Button variant="outline">
                    下载处理报告
                  </Button>
                  <Button>
                    浏览结果文件
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