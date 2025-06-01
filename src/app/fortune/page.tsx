'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ZiweiChart, BirthInfo, LunarDate } from '@/types';
import { calculateZiweiChart } from '@/lib/ziwei/calculator';
import ChartDisplay from '@/components/fortune/ChartDisplay';

export default function FortunePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [birthInfo, setBirthInfo] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    gender: 'male' as 'male' | 'female'
  });

  const timeHours = [
    { value: '0', label: '子时 (23:00-01:00)', name: '子时' },
    { value: '1', label: '丑时 (01:00-03:00)', name: '丑时' },
    { value: '2', label: '寅时 (03:00-05:00)', name: '寅时' },
    { value: '3', label: '卯时 (05:00-07:00)', name: '卯时' },
    { value: '4', label: '辰时 (07:00-09:00)', name: '辰时' },
    { value: '5', label: '巳时 (09:00-11:00)', name: '巳时' },
    { value: '6', label: '午时 (11:00-13:00)', name: '午时' },
    { value: '7', label: '未时 (13:00-15:00)', name: '未时' },
    { value: '8', label: '申时 (15:00-17:00)', name: '申时' },
    { value: '9', label: '酉时 (17:00-19:00)', name: '酉时' },
    { value: '10', label: '戌时 (19:00-21:00)', name: '戌时' },
    { value: '11', label: '亥时 (21:00-23:00)', name: '亥时' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setBirthInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setStep(2);

    try {
      // 构建出生信息
      const hourName = timeHours.find(h => h.value === birthInfo.hour)?.name || '未知';
      
      const lunarDate: LunarDate = {
        year: parseInt(birthInfo.year),
        month: parseInt(birthInfo.month),
        day: parseInt(birthInfo.day),
        hour: parseInt(birthInfo.hour),
        hourName,
        isLeapMonth: false // 简化处理，默认非闰月
      };

      const birth: BirthInfo = {
        gender: birthInfo.gender,
        lunarDate
      };

      // 使用新的准确计算库
      const calculatedChart = calculateZiweiChart(birth);
      setChart(calculatedChart);

      // 调用我们的API路由进行AI分析，设置超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2分钟超时

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ziwei',
          data: calculatedChart
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '分析失败');
      }

      const result = await response.json();
      setAnalysis(result.analysis);
      setStep(3);

    } catch (err: any) {
      console.error('分析失败:', err);
      if (err.name === 'AbortError') {
        setError('分析超时，请稍后重试。AI服务可能正在处理大量请求。');
      } else {
        setError(err instanceof Error ? err.message : '分析失败，请稍后重试');
      }
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnalysis('');
    setError('');
    setChart(null);
    setShowChart(false);
    setBirthInfo({
      year: '',
      month: '',
      day: '',
      hour: '',
      gender: 'male'
    });
  };

  const isFormValid = birthInfo.year && birthInfo.month && birthInfo.day && birthInfo.hour;

  return (
    <div className="min-h-screen py-8">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-wechat-text-primary mb-4">
              紫薇斗数运势预测
            </h1>
            <p className="text-lg text-wechat-text-secondary">
              基于倪海厦理论，为您精确分析命盘运势
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

          {/* 错误提示 */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-600">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>输入出生信息</CardTitle>
                  <CardDescription>
                    请准确填写您的农历出生年月日时，这将影响命盘计算的准确性
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 性别选择 */}
                  <div>
                    <label className="block text-sm font-medium text-wechat-text-primary mb-3">
                      性别
                    </label>
                    <div className="flex space-x-4">
                      <button
                        className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                          birthInfo.gender === 'male'
                            ? 'bg-wechat-primary text-white border-wechat-primary'
                            : 'bg-wechat-surface text-wechat-text-primary border-wechat-border hover:bg-wechat-background'
                        }`}
                        onClick={() => handleInputChange('gender', 'male')}
                      >
                        男
                      </button>
                      <button
                        className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                          birthInfo.gender === 'female'
                            ? 'bg-wechat-primary text-white border-wechat-primary'
                            : 'bg-wechat-surface text-wechat-text-primary border-wechat-border hover:bg-wechat-background'
                        }`}
                        onClick={() => handleInputChange('gender', 'female')}
                      >
                        女
                      </button>
                    </div>
                  </div>

                  {/* 农历出生日期 */}
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="农历年"
                      type="number"
                      placeholder="如：1990"
                      value={birthInfo.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      min="1900"
                      max="2100"
                    />
                    <Input
                      label="农历月"
                      type="number"
                      placeholder="如：5"
                      value={birthInfo.month}
                      onChange={(e) => handleInputChange('month', e.target.value)}
                      min="1"
                      max="12"
                    />
                    <Input
                      label="农历日"
                      type="number"
                      placeholder="如：15"
                      value={birthInfo.day}
                      onChange={(e) => handleInputChange('day', e.target.value)}
                      min="1"
                      max="30"
                    />
                  </div>

                  {/* 时辰选择 */}
                  <div>
                    <label className="block text-sm font-medium text-wechat-text-primary mb-3">
                      出生时辰
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-wechat-border rounded-lg bg-wechat-surface text-wechat-text-primary focus:outline-none focus:ring-2 focus:ring-wechat-primary focus:border-transparent"
                      value={birthInfo.hour}
                      onChange={(e) => handleInputChange('hour', e.target.value)}
                    >
                      <option value="">请选择时辰</option>
                      {timeHours.map((hour) => (
                        <option key={hour.value} value={hour.value}>
                          {hour.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 提示信息 */}
                  <div className="bg-wechat-background p-4 rounded-lg">
                    <h4 className="font-medium text-wechat-text-primary mb-2">💡 温馨提示</h4>
                    <ul className="text-sm text-wechat-text-secondary space-y-1">
                      <li>• 请使用农历日期，如不确定可查询万年历</li>
                      <li>• 时辰对命盘影响很大，请尽量准确填写</li>
                      <li>• 如不知道确切时辰，可选择最接近的时间段</li>
                      <li>• 新版本使用传统紫薇斗数算法，结果更加准确</li>
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!isFormValid || loading}
                  >
                    {loading ? '计算中...' : '开始计算命盘'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>正在计算命盘...</CardTitle>
                  <CardDescription>
                    正在基于您的出生信息计算紫薇斗数命盘，请稍候
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-wechat-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-wechat-text-secondary mb-2">
                    正在排布星宿位置...
                  </p>
                  <p className="text-sm text-wechat-text-muted mb-4">
                    AI正在基于倪海厦理论进行深度分析
                  </p>
                  <div className="bg-wechat-background p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-xs text-wechat-text-muted">
                      ⏱️ 预计需要 5-15 秒完成分析
                    </p>
                    <p className="text-xs text-wechat-text-muted mt-1">
                      🤖 AI正在运用专业知识进行分析
                    </p>
                    <p className="text-xs text-wechat-text-muted mt-1">
                      ✨ 使用传统算法，确保结果准确
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && analysis && chart && (
            <div className="space-y-6">
              {/* 命盘可视化 */}
              {showChart && (
                <Card>
                  <CardHeader>
                    <CardTitle>您的紫薇命盘</CardTitle>
                    <CardDescription>
                      基于传统紫薇斗数算法计算的准确命盘
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartDisplay chart={chart} />
                  </CardContent>
                </Card>
              )}

              {/* 命盘信息展示 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>命盘基本信息</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowChart(!showChart)}
                    >
                      {showChart ? '隐藏命盘' : '查看命盘'}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    基于传统紫薇斗数算法计算的准确命盘信息
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 出生信息回显 */}
                  <div className="bg-wechat-background p-4 rounded-lg">
                    <h4 className="font-medium text-wechat-text-primary mb-2">📅 出生信息</h4>
                    <div className="text-sm text-wechat-text-secondary grid grid-cols-2 gap-2">
                      <p>性别：{birthInfo.gender === 'male' ? '男' : '女'}</p>
                      <p>农历：{birthInfo.year}年{birthInfo.month}月{birthInfo.day}日</p>
                      <p>时辰：{timeHours.find(h => h.value === birthInfo.hour)?.name}</p>
                      <p>命宫：{chart.palaces[chart.mainPalace].name}({chart.palaces[chart.mainPalace].earthlyBranch})</p>
                    </div>
                  </div>

                  {/* 主要星宿展示 */}
                  <div className="bg-wechat-background p-4 rounded-lg">
                    <h4 className="font-medium text-wechat-text-primary mb-3">⭐ 主要星宿分布</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {chart.palaces.map((palace) => {
                        const mainStarsInPalace = palace.stars.filter(star => star.type === 'main');
                        if (mainStarsInPalace.length === 0) return null;
                        
                        return (
                          <div key={palace.id} className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className={`font-medium ${palace.isMainPalace ? 'text-red-600' : palace.isBodyPalace ? 'text-blue-600' : 'text-wechat-text-primary'}`}>
                              {palace.name}
                              {palace.isMainPalace && ' (命)'}
                              {palace.isBodyPalace && ' (身)'}
                            </span>
                            <span className="text-wechat-text-secondary">
                              {mainStarsInPalace.map(star => star.name).join('、')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI分析结果 */}
              <Card>
                <CardHeader>
                  <CardTitle>您的运势分析</CardTitle>
                  <CardDescription>
                    基于倪海厦紫薇斗数理论的专业分析结果
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-wechat-text-primary leading-relaxed">
                      {analysis}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleReset}
                    >
                      重新预测
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        // 保存到本地存储
                        const result = {
                          birthInfo,
                          chart,
                          analysis,
                          timestamp: new Date().toISOString()
                        };
                        localStorage.setItem('fortune_result', JSON.stringify(result));
                        alert('分析结果已保存到本地');
                      }}
                    >
                      保存结果
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 