import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const features = [
    {
      title: '紫薇斗数命盘',
      description: '基于倪海厦理论，精确计算您的命盘，分析命格特质、财运、事业、感情等各方面运势',
      icon: '⭐',
      href: '/fortune',
      color: 'bg-traditional-gold'
    },
    {
      title: '周易占卜解读',
      description: '传统周易占卜方式，针对具体问题生成卦象，提供专业的卦象解读和指导建议',
      icon: '☯',
      href: '/divination',
      color: 'bg-traditional-yin'
    },
    {
      title: '倪海厦知识库',
      description: '涵盖紫微斗数、易经占卜、风水地理、中医经方等传统文化精髓的专业知识库',
      icon: '📚',
      href: '/knowledge',
      color: 'bg-blue-500'
    }
  ];

  const advantages = [
    {
      title: '专业理论基础',
      description: '基于倪海厦先生的传统中医和命理学理论体系',
      icon: '📚'
    },
    {
      title: 'AI智能分析',
      description: '结合现代AI技术，提供个性化的深度分析',
      icon: '🤖'
    },
    {
      title: '隐私安全保护',
      description: '所有数据存储在本地，不收集用户个人信息',
      icon: '🔒'
    },
    {
      title: '移动端优化',
      description: '完美适配手机和电脑端，随时随地使用',
      icon: '📱'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wechat-primary to-wechat-secondary text-white py-20">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              倪海厦运势预测
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              基于传统理论的专业命理分析平台
            </p>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              融合倪海厦先生的紫薇斗数与周易理论，结合现代AI技术，
              为您提供准确的运势分析和人生指导
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fortune">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  开始运势预测
                </Button>
              </Link>
              <Link href="/divination">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-wechat-primary">
                  周易占卜解读
                </Button>
              </Link>
              <Link href="/knowledge">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-wechat-primary">
                  知识库搜索
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-wechat-text-primary mb-4">
              核心功能
            </h2>
            <p className="text-lg text-wechat-text-secondary max-w-2xl mx-auto">
              专业的命理分析工具，助您洞察人生运势
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-wechat-primary transition-colors">
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
                      立即体验
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-wechat-surface">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-wechat-text-primary mb-4">
              为什么选择我们
            </h2>
            <p className="text-lg text-wechat-text-secondary max-w-2xl mx-auto">
              专业、安全、便捷的命理分析体验
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <Card key={index} padding="md" className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent>
                  <div className="text-4xl mb-4">{advantage.icon}</div>
                  <h3 className="text-lg font-semibold text-wechat-text-primary mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-sm text-wechat-text-secondary">
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
        <div className="container-responsive">
          <Card className="text-center bg-gradient-to-r from-wechat-primary to-wechat-secondary text-white border-none">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                开始您的命理之旅
              </h2>
              <p className="text-lg mb-8 opacity-90">
                探索命运奥秘，把握人生机遇
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/fortune">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    紫薇斗数分析
                  </Button>
                </Link>
                <Link href="/divination">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-wechat-primary">
                    周易占卜咨询
                  </Button>
                </Link>
                <Link href="/knowledge">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-wechat-primary">
                    知识库学习
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
