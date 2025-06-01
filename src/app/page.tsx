import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const features = [
    {
      title: 'PDF OCR 识别',
      description: '使用 SiliconFlow API 进行高精度的 PDF 文档 OCR 识别，支持倪海厦中医文档',
      icon: '📄',
      href: '/ocr',
      color: 'bg-blue-500'
    },
    {
      title: '知识库构建',
      description: '自动将识别的文本转换为结构化的 JSON 知识库，支持分类标签和搜索',
      icon: '🗂️',
      href: '/knowledge',
      color: 'bg-green-500'
    },
    {
      title: '批量处理',
      description: '支持大规模 PDF 文档的批量处理，自动分类存储到对应的知识库目录',
      icon: '⚡',
      href: '/batch',
      color: 'bg-purple-500'
    }
  ];

  const advantages = [
    {
      title: '高精度识别',
      description: '基于 Qwen2.5-VL-72B-Instruct 模型的先进视觉识别技术',
      icon: '🎯'
    },
    {
      title: '智能分类',
      description: '自动识别文档类型：天纪、人纪、针灸、中药、医案、方剂',
      icon: '🧠'
    },
    {
      title: '结构化输出',
      description: 'JSON 格式的知识库，便于 AI 系统调用和检索',
      icon: '📊'
    },
    {
      title: '本地部署',
      description: '完全本地化处理，保护数据安全和隐私',
      icon: '🔒'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI OCR 知识库处理系统
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              将 PDF 文档转换为 AI 可调用的结构化知识库
            </p>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              基于 SiliconFlow API 的高精度 OCR 识别技术，
              专门为倪海夏中医文档设计的知识库构建平台
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ocr">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                  开始 OCR 识别
                </Button>
              </Link>
              <Link href="/knowledge">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  浏览知识库
                </Button>
              </Link>
              <Link href="/batch">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  批量处理
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              核心功能
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              专业的 PDF OCR 识别和知识库构建工具
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-2xl text-white`}>
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6">
                    {feature.description}
                  </CardDescription>
                  <Link href={feature.href}>
                    <Button className="w-full">
                      立即使用
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              技术优势
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              先进的 AI OCR 技术，专业的知识库构建方案
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <Card key={index} padding="md" className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent>
                  <div className="text-4xl mb-4">{advantage.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white border-none">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                开始构建您的知识库
              </h2>
              <p className="text-lg mb-8 opacity-90">
                将 PDF 文档转换为 AI 可理解的结构化知识库
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ocr">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                    单文档处理
                  </Button>
                </Link>
                <Link href="/batch">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                    批量处理
                  </Button>
                </Link>
                <Link href="/knowledge">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                    查看结果
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
