'use client'

import React from 'react'
import KnowledgeStats from '@/components/knowledge/KnowledgeStats'

export default function KnowledgePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          倪海厦理论知识库
        </h1>
        <p className="text-gray-600">
          基于倪海厦老师理论的命理学、中医学、风水学知识库
        </p>
      </div>

      <div className="mb-8">
        <KnowledgeStats />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">知识搜索</h2>
        <p className="text-gray-600">搜索功能正在开发中，敬请期待...</p>
      </div>
    </div>
  )
}