'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: '全部', count: 156 },
    { id: 'tianji', name: '天纪', count: 45 },
    { id: 'renji', name: '人纪', count: 67 },
    { id: 'zhenjiu', name: '针灸', count: 23 },
    { id: 'zhongyao', name: '中药', count: 12 },
    { id: 'yian', name: '医案', count: 6 },
    { id: 'fangji', name: '方剂', count: 3 }
  ]

  const sampleDocuments = [
    {
      id: 1,
      title: '快乐生活的问诊单',
      category: 'tianji',
      pages: 4,
      processed: '2024-01-15',
      content: '基础的中医问诊方法，包含望闻问切四诊合参的详细说明...',
      size: '2.3KB'
    },
    {
      id: 2,
      title: '天纪第一章：阴阳五行基础',
      category: 'tianji',
      pages: 12,
      processed: '2024-01-14',
      content: '详细介绍阴阳五行的基本理论，是学习中医的基础...',
      size: '8.7KB'
    },
    {
      id: 3,
      title: '伤寒论条文解析',
      category: 'renji',
      pages: 45,
      processed: '2024-01-13',
      content: '伤寒论经典条文的现代解读和临床应用指导...',
      size: '23.1KB'
    }
  ]

  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI OCR 知识库
          </h1>
          <p className="text-lg text-gray-600">
            浏览和搜索已处理的倪海夏中医文档知识库
          </p>
        </div>

        {/* 统计信息 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
              <div className="text-sm text-gray-600">已处理文档</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-green-600 mb-2">1,247</div>
              <div className="text-sm text-gray-600">页面总数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">567KB</div>
              <div className="text-sm text-gray-600">知识库大小</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">98.5%</div>
              <div className="text-sm text-gray-600">识别准确率</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边栏 - 分类筛选 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>文档分类</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 搜索栏 */}
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="搜索文档标题或内容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button>搜索</Button>
                </div>
              </CardContent>
            </Card>

            {/* 文档列表 */}
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>
                          {categories.find(c => c.id === doc.category)?.name} • 
                          {doc.pages} 页 • 
                          处理日期: {doc.processed}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{doc.size}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{doc.content}</p>
                    <div className="flex space-x-2">
                      <Button size="sm">查看详情</Button>
                      <Button size="sm" variant="outline">下载JSON</Button>
                      <Button size="sm" variant="outline">下载TXT</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📚</div>
                  <p className="text-gray-600">未找到匹配的文档</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}