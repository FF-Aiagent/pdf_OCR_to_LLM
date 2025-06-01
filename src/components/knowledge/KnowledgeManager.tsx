import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface KnowledgeStats {
  documents: number;
  chunks: number;
  keywords: number;
  categories: {
    ziwei: number;
    iching: number;
    general: number;
  };
}

interface SearchResult {
  id: string;
  content: string;
  page: number;
  keywords: string[];
  category: 'ziwei' | 'iching' | 'general';
  relevanceScore?: number;
}

interface UploadedDocument {
  id: string;
  title: string;
  category: 'ziwei' | 'iching' | 'general';
  pages: number;
  chunks: number;
  extractedAt: string;
}

const KnowledgeManager: React.FC = () => {
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'ziwei' | 'iching' | 'general'>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取知识库统计信息
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/knowledge/upload');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  };

  // 上传PDF文件
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`成功上传并解析文档：${data.document.title}`);
        setUploadedDocs(prev => [data.document, ...prev]);
        setStats(data.stats);
      } else {
        setError(data.error || '上传失败');
      }
    } catch (error) {
      setError('上传过程中发生错误');
      console.error('上传错误:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 搜索知识库
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('请输入搜索关键词');
      return;
    }

    setSearching(true);
    setError('');

    try {
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          category: searchCategory === 'all' ? undefined : searchCategory,
          limit: 20
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
        if (data.results.length === 0) {
          setError('未找到相关内容');
        }
      } else {
        setError(data.error || '搜索失败');
      }
    } catch (error) {
      setError('搜索过程中发生错误');
      console.error('搜索错误:', error);
    } finally {
      setSearching(false);
    }
  };

  // 组件挂载时获取统计信息
  React.useEffect(() => {
    fetchStats();
  }, []);

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'ziwei': return '紫薇斗数';
      case 'iching': return '周易';
      case 'general': return '通用';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ziwei': return 'bg-purple-100 text-purple-700';
      case 'iching': return 'bg-blue-100 text-blue-700';
      case 'general': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-wechat-text-primary mb-2">
          知识库管理
        </h1>
        <p className="text-wechat-text-secondary">
          上传倪海厦PDF教材，构建专业的预测知识库
        </p>
      </div>

      {/* 错误和成功提示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-600">
              <span>✅</span>
              <span>{success}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 知识库统计 */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>知识库统计</CardTitle>
            <CardDescription>当前知识库的内容统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-wechat-background rounded-lg">
                <div className="text-2xl font-bold text-wechat-primary">{stats.documents}</div>
                <div className="text-sm text-wechat-text-secondary">文档数量</div>
              </div>
              <div className="text-center p-4 bg-wechat-background rounded-lg">
                <div className="text-2xl font-bold text-wechat-primary">{stats.chunks}</div>
                <div className="text-sm text-wechat-text-secondary">知识块</div>
              </div>
              <div className="text-center p-4 bg-wechat-background rounded-lg">
                <div className="text-2xl font-bold text-wechat-primary">{stats.keywords}</div>
                <div className="text-sm text-wechat-text-secondary">关键词</div>
              </div>
              <div className="text-center p-4 bg-wechat-background rounded-lg">
                <div className="text-2xl font-bold text-wechat-primary">
                  {stats.categories.ziwei + stats.categories.iching + stats.categories.general}
                </div>
                <div className="text-sm text-wechat-text-secondary">总知识点</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-700">{stats.categories.ziwei}</div>
                <div className="text-sm text-purple-600">紫薇斗数</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-700">{stats.categories.iching}</div>
                <div className="text-sm text-blue-600">周易</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">{stats.categories.general}</div>
                <div className="text-sm text-gray-600">通用</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PDF上传 */}
      <Card>
        <CardHeader>
          <CardTitle>上传PDF文档</CardTitle>
          <CardDescription>
            上传倪海厦的PDF教材，系统会自动解析并添加到知识库
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-wechat-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="space-y-2">
              <div className="text-4xl">📄</div>
              <div className="text-lg font-medium text-wechat-text-primary">
                {uploading ? '正在上传和解析...' : '选择PDF文件'}
              </div>
              <div className="text-sm text-wechat-text-secondary">
                支持倪海厦天纪、人纪等PDF教材，最大10MB
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-4"
              >
                {uploading ? '处理中...' : '选择文件'}
              </Button>
            </div>
          </div>

          <div className="bg-wechat-background p-4 rounded-lg">
            <h4 className="font-medium text-wechat-text-primary mb-2">💡 使用说明</h4>
            <ul className="text-sm text-wechat-text-secondary space-y-1">
              <li>• 支持倪海厦先生的天纪、人纪等PDF教材</li>
              <li>• 系统会自动识别文档类型（紫薇斗数/周易）</li>
              <li>• 文档会被分割成知识块，便于AI检索</li>
              <li>• 上传后的知识会立即用于预测分析</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 知识库搜索 */}
      <Card>
        <CardHeader>
          <CardTitle>搜索知识库</CardTitle>
          <CardDescription>
            搜索已上传的PDF文档内容
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="输入搜索关键词，如：紫薇星、命宫、八卦等"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              className="px-4 py-2 border border-wechat-border rounded-lg bg-wechat-surface"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value as any)}
            >
              <option value="all">全部类别</option>
              <option value="ziwei">紫薇斗数</option>
              <option value="iching">周易</option>
              <option value="general">通用</option>
            </select>
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? '搜索中...' : '搜索'}
            </Button>
          </div>

          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-wechat-text-primary">
                搜索结果 ({searchResults.length} 条)
              </h4>
              {searchResults.map((result) => (
                <div key={result.id} className="border border-wechat-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(result.category)}`}>
                      {getCategoryName(result.category)}
                    </span>
                    <div className="text-xs text-wechat-text-muted">
                      第{result.page}页 | 相关度: {result.relevanceScore}
                    </div>
                  </div>
                  <div className="text-sm text-wechat-text-primary mb-2">
                    {result.content}
                  </div>
                  {result.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.slice(0, 5).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-wechat-background text-xs text-wechat-text-secondary rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 已上传文档列表 */}
      {uploadedDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>已上传文档</CardTitle>
            <CardDescription>
              本次会话中上传的文档列表
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center p-3 border border-wechat-border rounded-lg">
                  <div>
                    <div className="font-medium text-wechat-text-primary">{doc.title}</div>
                    <div className="text-sm text-wechat-text-secondary">
                      {doc.pages} 页 | {doc.chunks} 个知识块 | 
                      上传时间: {new Date(doc.extractedAt).toLocaleString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(doc.category)}`}>
                    {getCategoryName(doc.category)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeManager; 