'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function DivinationPage() {
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hexagram, setHexagram] = useState<any>(null);

  const handleQuestionSubmit = () => {
    if (question.trim()) {
      setStep(2);
      generateHexagram();
    }
  };

  const generateHexagram = async () => {
    setIsGenerating(true);
    
    // 模拟投币过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 这里将来会调用真实的卦象生成逻辑
    const mockHexagram = {
      name: '乾为天',
      upperTrigram: { name: '乾', symbol: '☰' },
      lowerTrigram: { name: '乾', symbol: '☰' },
      lines: [
        { type: 'yang', isChanging: false },
        { type: 'yang', isChanging: false },
        { type: 'yang', isChanging: false },
        { type: 'yang', isChanging: false },
        { type: 'yang', isChanging: false },
        { type: 'yang', isChanging: false }
      ],
      judgment: '乾：元，亨，利，贞。',
      interpretation: '此卦象征天道刚健，君子当自强不息...'
    };
    
    setHexagram(mockHexagram);
    setIsGenerating(false);
    setStep(3);
  };

  const resetDivination = () => {
    setStep(1);
    setQuestion('');
    setHexagram(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-responsive">
        <div className="max-w-2xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-wechat-text-primary mb-4">
              周易占卜解读
            </h1>
            <p className="text-lg text-wechat-text-secondary">
              传统周易占卜，为您的疑问提供智慧指引
            </p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-wechat-primary text-white' : 'bg-wechat-border text-wechat-text-muted'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-wechat-primary' : 'bg-wechat-border'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-wechat-primary text-white' : 'bg-wechat-border text-wechat-text-muted'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-wechat-primary' : 'bg-wechat-border'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-wechat-primary text-white' : 'bg-wechat-border text-wechat-text-muted'
              }`}>
                3
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>请输入您的问题</CardTitle>
                <CardDescription>
                  请诚心提出您想要占卜的问题，问题越具体，解读越准确
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-wechat-text-primary mb-3">
                    占卜问题
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-wechat-border rounded-lg bg-wechat-surface text-wechat-text-primary placeholder-wechat-text-muted focus:outline-none focus:ring-2 focus:ring-wechat-primary focus:border-transparent resize-none"
                    rows={4}
                    placeholder="请输入您想要占卜的问题，例如：我最近的工作运势如何？"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                {/* 占卜须知 */}
                <div className="bg-wechat-background p-4 rounded-lg">
                  <h4 className="font-medium text-wechat-text-primary mb-2">🔮 占卜须知</h4>
                  <ul className="text-sm text-wechat-text-secondary space-y-1">
                    <li>• 请以诚心诚意的态度提出问题</li>
                    <li>• 问题应该具体明确，避免过于宽泛</li>
                    <li>• 同一问题不宜重复占卜</li>
                    <li>• 占卜结果仅供参考，不可过分依赖</li>
                  </ul>
                </div>

                {/* 问题示例 */}
                <div className="bg-wechat-surface border border-wechat-border p-4 rounded-lg">
                  <h4 className="font-medium text-wechat-text-primary mb-2">💡 问题示例</h4>
                  <div className="space-y-2">
                    {[
                      '我最近的财运如何？',
                      '这次投资决定是否明智？',
                      '我和某人的关系发展如何？',
                      '换工作的时机是否合适？'
                    ].map((example, index) => (
                      <button
                        key={index}
                        className="block w-full text-left text-sm text-wechat-text-secondary hover:text-wechat-primary transition-colors duration-200 py-1"
                        onClick={() => setQuestion(example)}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleQuestionSubmit}
                  disabled={!question.trim()}
                >
                  开始占卜
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>正在生成卦象...</CardTitle>
                <CardDescription>
                  正在为您的问题生成卦象，请保持内心宁静
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="space-y-6">
                  {/* 投币动画 */}
                  <div className="flex justify-center space-x-4">
                    {[1, 2, 3].map((coin) => (
                      <div
                        key={coin}
                        className="w-12 h-12 bg-traditional-gold rounded-full flex items-center justify-center text-white font-bold animate-bounce"
                        style={{ animationDelay: `${coin * 0.2}s` }}
                      >
                        币
                      </div>
                    ))}
                  </div>
                  <p className="text-wechat-text-secondary">
                    正在投掷铜钱，生成卦象...
                  </p>
                  <div className="text-sm text-wechat-text-muted">
                    您的问题：{question}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && hexagram && (
            <div className="space-y-6">
              {/* 卦象展示 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">{hexagram.name}</CardTitle>
                  <CardDescription className="text-center">
                    您的问题：{question}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <div className="space-y-2">
                      {/* 上卦 */}
                      <div className="text-center">
                        <div className="text-2xl mb-2">{hexagram.upperTrigram.symbol}</div>
                        <div className="text-sm text-wechat-text-secondary">{hexagram.upperTrigram.name}</div>
                      </div>
                      
                      {/* 卦象线条 */}
                      <div className="space-y-1 py-4">
                        {hexagram.lines.slice().reverse().map((line: any, index: number) => (
                          <div key={index} className="flex justify-center">
                            {line.type === 'yang' ? (
                              <div className="w-16 h-1 bg-traditional-yang rounded" />
                            ) : (
                              <div className="w-16 h-1 bg-traditional-yin rounded relative">
                                <div className="absolute left-1/2 top-0 w-2 h-full bg-wechat-surface transform -translate-x-1/2" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* 下卦 */}
                      <div className="text-center">
                        <div className="text-sm text-wechat-text-secondary">{hexagram.lowerTrigram.name}</div>
                        <div className="text-2xl mt-2">{hexagram.lowerTrigram.symbol}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 卦辞 */}
                  <div className="bg-wechat-background p-4 rounded-lg">
                    <h4 className="font-medium text-wechat-text-primary mb-2">卦辞</h4>
                    <p className="text-wechat-text-secondary">{hexagram.judgment}</p>
                  </div>
                </CardContent>
              </Card>

              {/* 解读结果 */}
              <Card>
                <CardHeader>
                  <CardTitle>卦象解读</CardTitle>
                  <CardDescription>
                    基于周易理论的专业解读
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-wechat-text-primary leading-relaxed">
                      {hexagram.interpretation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <div className="flex space-x-4">
                <Button variant="outline" onClick={resetDivination} className="flex-1">
                  重新占卜
                </Button>
                <Button className="flex-1">
                  保存结果
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 