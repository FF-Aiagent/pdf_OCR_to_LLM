'use client';

import React, { useState } from 'react';
import { Search, Book, Star, Tag } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  content: string;
  title?: string;
  source: string;
  domain?: string;
  subdomain?: string;
  keywords: string[];
  category: string;
  relevanceScore: number;
  type: string;
}

interface SearchResult {
  success: boolean;
  query: string;
  total: number;
  results: KnowledgeItem[];
  sources: {
    nihaixia: number;
    pdf: number;
  };
}

export default function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState('all');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          source: selectedSource,
          limit: 10
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('搜索失败');
      }
    } catch (error) {
      console.error('搜索错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Book className="mr-2 text-blue-600" />
          倪海厦知识库搜索
        </h2>

        {/* 搜索区域 */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="搜索紫微斗数、易经、中医等知识..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '搜索中...' : '搜索'}
            </button>
          </div>

          {/* 数据源选择 */}
          <div className="flex gap-2">
            <label className="text-sm text-gray-600">数据源:</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">全部</option>
              <option value="nihaixia">倪海厦知识库</option>
              <option value="pdf">PDF文档</option>
            </select>
          </div>
        </div>

        {/* 搜索结果 */}
        {results && (
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>找到 {results.total} 个相关结果</span>
                <div className="flex gap-4">
                  <span>倪海厦知识库: {results.sources.nihaixia}</span>
                  <span>PDF文档: {results.sources.pdf}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {results.results.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      {item.title && (
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                      )}
                      <p className="text-gray-600 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-500">
                        {(item.relevanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.keywords.slice(0, 5).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex gap-4">
                      <span>来源: {item.source === 'nihaixia' ? '倪海厦知识库' : 'PDF文档'}</span>
                      {item.domain && <span>领域: {item.domain}</span>}
                      {item.subdomain && <span>子领域: {item.subdomain}</span>}
                    </div>
                    <span>类型: {item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!results && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>输入关键词搜索倪海厦知识库</p>
            <p className="text-sm mt-2">支持搜索紫微斗数、易经占卜、风水、中医等内容</p>
          </div>
        )}
      </div>
    </div>
  );
} 