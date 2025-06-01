'use client'

import React from 'react'

export default function KnowledgeStats() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">知识库统计</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">1000+</div>
          <div className="text-sm text-gray-600">理论条目</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">500+</div>
          <div className="text-sm text-gray-600">案例分析</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">4</div>
          <div className="text-sm text-gray-600">学科领域</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">100%</div>
          <div className="text-sm text-gray-600">倪海厦理论</div>
        </div>
      </div>
    </div>
  )
}