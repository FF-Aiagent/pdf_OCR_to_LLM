import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "倪海厦运势预测 - 紫薇斗数与周易占卜",
  description: "基于倪海厦理论的专业运势预测和周易占卜网站，提供紫薇斗数命盘分析和卦象解读服务",
  keywords: ["紫薇斗数", "周易", "占卜", "运势预测", "倪海厦", "命理"],
  authors: [{ name: "Fortune Prediction Team" }],
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
              <p className="mb-2">© 2024 倪海厦运势预测网站. 保留所有权利.</p>
              <p className="text-sm">
                本网站仅供学习和研究使用，预测结果仅供参考，不构成任何形式的建议或保证。
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
