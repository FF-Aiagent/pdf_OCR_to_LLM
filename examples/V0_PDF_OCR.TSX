'use client'

import React, { useState, useCallback } from 'react'
import { Upload, FileText, Brain, Download, CheckCircle, Loader, BarChart3 } from 'lucide-react'

export default function PDFOCRApp() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setResult(null)
    } else {
      alert('请选择PDF文件')
    }
  }, [])

  const simulateProcessing = async () => {
    if (!file) return
    setIsProcessing(true)
    setProgress(0)
    
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    setResult({
      filename: file.name,
      totalPages: Math.floor(Math.random() * 50) + 10,
      successPages: Math.floor(Math.random() * 45) + 8,
      totalChars: Math.floor(Math.random() * 50000) + 20000,
      completionRate: Math.floor(Math.random() * 20) + 80
    })
    
    setIsProcessing(false)
  }

  const downloadResult = () => {
    if (!result) return
    
    const mockData = {
      document: {
        filename: result.filename,
        total_pages: result.totalPages,
        processed_pages: result.successPages,
        model: 'Qwen/Qwen2.5-VL-72B-Instruct',
        processed_date: new Date().toISOString()
      },
      stats: {
        success: result.successPages,
        failed: result.totalPages - result.successPages,
        total_chars: result.totalChars,
        completion_rate: result.completionRate
      },
      content_preview: "气血双虚，宜补益气血。方用八珍汤加减：人参、白术、茯苓、甘草、当归、川芎、白芍、熟地各三钱。肝郁脾虚证候：胸胁胀痛，善太息，食少腹胀，便溏不爽。治法：疏肝健脾。方药：逍遥散加减。心肾不交，失眠多梦。症见心烦不寐，头晕耳鸣，腰膝酸软，五心烦热。治以交通心肾，方用交泰丸..."
    }
    
    const dataStr = JSON.stringify(mockData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', `中医知识库_${result.filename.replace('.pdf', '')}.json`)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Brain className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">
            AI中医古籍OCR识别器
          </h1>
          <p className="text-white/90 text-lg">
            专业的PDF文字识别与知识库生成平台
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="text-center">
            <Upload className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">上传中医PDF文档</h2>
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            
            <label 
              htmlFor="file-input" 
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg font-semibold"
            >
              选择PDF文件
            </label>
            
            {file && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-800">{file.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {file && !result && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-2xl text-center">
            <button
              onClick={simulateProcessing}
              disabled={isProcessing}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-xl disabled:opacity-60"
            >
              {isProcessing ? <Loader className="w-6 h-6 animate-spin" /> : <Brain className="w-6 h-6" />}
              {isProcessing ? 'AI识别中...' : '开始AI智能识别'}
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">处理进度</h3>
            <div className="text-center mb-4">
              <div className="text-lg font-semibold text-gray-700 mb-2">
                🧠 AI正在识别PDF内容...
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center font-bold text-lg text-gray-700">
              {progress}%
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">知识库生成完成</h3>
              <p className="text-gray-600">AI已成功识别并生成结构化知识库文件</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">{result.totalPages}</div>
                <div className="text-sm font-semibold text-gray-600">总页数</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">{result.successPages}</div>
                <div className="text-sm font-semibold text-gray-600">成功识别</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">{result.totalChars.toLocaleString()}</div>
                <div className="text-sm font-semibold text-gray-600">总字符数</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-2xl font-bold text-orange-600 mb-1">{result.completionRate}%</div>
                <div className="text-sm font-semibold text-gray-600">完成率</div>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <button
                onClick={downloadResult}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-xl"
              >
                <Download className="w-6 h-6" />
                下载中医知识库文件
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-3 text-gray-800">📖 内容预览</h4>
              <div className="bg-white p-4 rounded-lg border text-sm text-gray-700 leading-relaxed">
                气血双虚，宜补益气血。方用八珍汤加减：人参、白术、茯苓、甘草、当归、川芎、白芍、熟地各三钱。
                <br /><br />
                肝郁脾虚证候：胸胁胀痛，善太息，食少腹胀，便溏不爽。治法：疏肝健脾。方药：逍遥散加减。
                <br /><br />
                <span className="text-gray-500 italic">(以上为模拟识别内容)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-8 text-white/80 mt-12">
        <p>© 2024 AI中医古籍OCR识别器 - 专业的PDF文字识别平台</p>
      </footer>
    </div>
  )
}