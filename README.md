# AI OCR 知识库处理系统 🚀

基于 SiliconFlow API 和 Next.js 构建的智能 PDF 文档 OCR 识别与知识库处理系统。

## ✨ 功能特性

- 📄 **PDF OCR 识别** - 使用 Qwen2.5-VL-72B-Instruct 模型进行智能识别
- 🗂️ **智能分类** - 自动分类天纪、人纪、针灸、中药、医案、方剂等文档
- 📚 **知识库构建** - 生成结构化 JSON 和 TXT 格式知识库
- ⚡ **批量处理** - 支持大规模 PDF 文档批量处理
- 🎨 **现代化界面** - 响应式设计，支持移动端访问

## 🎯 项目概述

本项目是一个完整的 PDF 文档 OCR 识别和知识库构建系统，具有以下特色：

- **高精度 OCR 识别**：使用 SiliconFlow 的 Qwen2.5-VL-72B-Instruct 模型
- **智能文档分类**：自动识别天纪、人纪、针灸、中药、医案、方剂等分类
- **结构化输出**：生成 JSON 和 TXT 格式的知识库文件
- **批量处理能力**：支持大规模 PDF 文档的自动化处理
- **Web 界面管理**：基于 Next.js 的现代化前端界面

## 🛠️ 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Python + PyMuPDF + SiliconFlow API
- **部署**: Vercel + GitHub

## 🚀 Vercel 部署指南

### 1. 前置要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn
- GitHub 账号
- Vercel 账号

### 2. 快速部署步骤

#### 方法一：从 GitHub 直接部署
1. Fork 或 Clone 本仓库到你的 GitHub 账号
2. 访问 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动识别为 Next.js 项目
6. 配置环境变量（见下方）
7. 点击 "Deploy"

#### 方法二：使用 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 在项目根目录部署
vercel

# 设置环境变量
vercel env add SILICONFLOW_API_KEY
```

### 3. 环境变量配置

在 Vercel 仪表板中，进入项目设置 > Environment Variables，添加以下变量：

```env
# 必需的 API 密钥
SILICONFLOW_API_KEY=your_siliconflow_api_key_here
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen2.5-VL-72B-Instruct

# 应用配置
NEXT_PUBLIC_APP_NAME=AI OCR 知识库处理系统
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_AI_MODEL=Qwen/Qwen2.5-VL-72B-Instruct

# 文件处理配置
MAX_FILE_SIZE=10MB
UPLOAD_DIR=uploads
TEMP_DIR=temp_files
KNOWLEDGE_DATA_DIR=knowledge_data
```

### 4. 部署后验证

部署完成后，访问你的 Vercel 域名，确认：
- ✅ 首页正常加载
- ✅ OCR 处理页面可以上传文件
- ✅ 知识库页面显示正常
- ✅ 批量处理功能正常

## 🔧 本地开发

### 1. 克隆项目
```bash
git clone https://github.com/your-username/pdf_OCR_to_LLM.git
cd pdf_OCR_to_LLM
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp env.example .env.local
# 编辑 .env.local 添加你的 API 密钥
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 📦 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── page.tsx        # 主页
│   │   ├── ocr/            # OCR 处理页面
│   │   ├── knowledge/      # 知识库页面
│   │   ├── batch/          # 批量处理页面
│   │   └── api/            # API 路由
│   ├── components/         # React 组件
│   ├── lib/               # 工具函数
│   └── types/             # TypeScript 类型定义
├── public/                # 静态资源
├── uploads/               # 文件上传目录
├── knowledge_data/        # 知识库数据
└── scripts/              # 处理脚本
```

## 🔧 核心功能

### 1. PDF OCR 识别

- 支持单文档和批量文档处理
- 使用 PyMuPDF 将 PDF 转换为高质量图片
- 调用 SiliconFlow API 进行 OCR 识别
- 自动处理多页文档

### 2. 智能分类

自动识别文档类型并分类：

- **天纪系列**：天机道、人间道、地脉道
- **人纪系列**：伤寒论、金匮要略、神农本草经、黄帝内经、针灸教程
- **医案集**：倪海厦先生医案、汉唐中医经典文章
- **方剂**：经典配方、扶阳讲记等

### 3. 结构化输出

生成标准化的知识库格式：

```json
{
  "document_info": {
    "title": "文档标题",
    "category": "tianji",
    "pages": 4,
    "processed_date": "2024-01-15"
  },
  "pages": [
    {
      "page_number": 1,
      "content": "页面文本内容",
      "confidence": 0.98
    }
  ],
  "metadata": {
    "total_characters": 2282,
    "processing_time": "2.5s"
  }
}
```

## 📊 处理能力

- **支持格式**：PDF 文档
- **处理速度**：约 2-4 页/分钟
- **识别准确率**：95%+ (根据文档质量)
- **批量处理**：支持 60+ 文档并发处理
- **文件大小**：支持最大 100MB 的 PDF 文件

## 🎯 使用场景

- **中医文献数字化**：将传统纸质文档转为数字化知识库
- **知识图谱构建**：为 AI 系统提供结构化的中医知识
- **AI 问答系统**：作为 RAG 系统的知识库准备
- **文档检索系统**：支持快速搜索和内容定位

## 📝 使用指南

### 单文档处理

1. 访问 `/ocr` 页面
2. 上传 PDF 文档
3. 点击"开始 OCR 识别"
4. 等待处理完成
5. 下载 JSON 或 TXT 格式结果

### 批量处理

1. 将 PDF 文件放入 `knowledge_data/` 目录
2. 访问 `/batch` 页面
3. 点击"开始批量处理"
4. 监控处理进度
5. 处理完成后查看结果统计

### 知识库浏览

1. 访问 `/knowledge` 页面
2. 使用分类筛选或搜索功能
3. 查看文档详情
4. 下载特定文档的处理结果

## 🔍 API 调用示例

```python
import requests
import base64

# 准备图片数据
with open("page_image.png", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

# 调用 OCR API
response = requests.post(
    "https://api.siliconflow.cn/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    },
    json={
        "model": "Qwen/Qwen2.5-VL-72B-Instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "请识别这个图片中的文字"},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_data}"}}
                ]
            }
        ]
    }
)
```

## 📈 性能优化

- **图片压缩**：自动调整图片大小以平衡质量和速度
- **批量处理**：支持多线程并发处理
- **错误重试**：网络异常时自动重试机制
- **进度跟踪**：实时显示处理进度和日志

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。详情请见 [LICENSE](LICENSE) 文件。

## 🔗 相关链接

- [SiliconFlow API 文档](https://docs.siliconflow.cn/)
- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 部署文档](https://vercel.com/docs)
- [项目演示](https://your-project.vercel.app)

---

**如果这个项目对你有帮助，请给个 ⭐ Star！**

## 🔍 故障排除

### 常见部署问题

1. **构建失败**: 确认 Node.js 版本 >= 18.0.0
2. **API 错误**: 检查环境变量是否正确设置
3. **文件上传失败**: 确认文件大小限制配置
4. **依赖安装失败**: 删除 `node_modules` 和 `package-lock.json` 重新安装

### Vercel 特定问题

1. **函数超时**: 在 `vercel.json` 中增加 `maxDuration`
2. **内存不足**: 升级到 Vercel Pro 计划
3. **构建时间过长**: 检查不必要的依赖

## 📝 更新日志

### v1.0.0 (2024-01)
- ✅ 初始版本发布
- ✅ 基础 OCR 功能实现
- ✅ 知识库构建功能
- ✅ 批量处理功能
- ✅ Vercel 部署优化

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系维护者。

---

**注意**：本项目专门用于处理倪海夏中医相关文档，OCR 识别效果可能因文档质量而异。建议使用高质量的 PDF 文档以获得最佳识别效果。
