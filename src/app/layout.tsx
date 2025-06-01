import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "AI OCR 知识库处理系统 - 基于SiliconFlow API的PDF文档识别",
  description: "基于SiliconFlow API的AI OCR知识库处理系统，专门用于倪海夏中医文档的OCR识别和知识库构建",
  keywords: ["AI", "OCR", "知识库", "PDF处理", "SiliconFlow", "倪海夏", "中医文档", "文档识别", "知识图谱"],
  authors: [{ name: "AI OCR Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-wechat-background">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-wechat-surface border-t border-wechat-border py-8 mt-16">
          <div className="container-responsive">
            <div className="text-center text-wechat-text-secondary">
              <p className="mb-2">© 2024 AI OCR 知识库处理系统. 保留所有权利.</p>
              <p className="text-sm">
                本系统仅供学习和研究使用，处理结果仅供参考，请确保数据安全和隐私保护。
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
