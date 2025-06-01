# AI OCR 知识库处理系统

基于 SiliconFlow API 的 PDF OCR 识别系统，专门用于将倪海夏中医文档转换为 AI 可调用的结构化知识库。

## 🎯 项目概述

本项目是一个完整的 PDF 文档 OCR 识别和知识库构建系统，具有以下特色：

- **高精度 OCR 识别**：使用 SiliconFlow 的 Qwen2.5-VL-72B-Instruct 模型
- **智能文档分类**：自动识别天纪、人纪、针灸、中药、医案、方剂等分类
- **结构化输出**：生成 JSON 和 TXT 格式的知识库文件
- **批量处理能力**：支持大规模 PDF 文档的自动化处理
- **Web 界面管理**：基于 Next.js 的现代化前端界面

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- Python 3.8+
- npm 或 yarn

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装Python依赖
pip install PyMuPDF requests pillow
```

### 配置API密钥

复制 `env.example` 文件为 `.env.local`：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，添加你的 SiliconFlow API 密钥：

```
SILICONFLOW_API_KEY=your_api_key_here
```

### 运行项目

```bash
# 启动开发服务器
npm run dev

# 浏览器访问 http://localhost:3000
```

## 📁 项目结构

```
├── src/
│   ├── app/                    # Next.js 应用页面
│   │   ├── page.tsx           # 首页
│   │   ├── ocr/               # 单文档OCR页面
│   │   ├── knowledge/         # 知识库浏览页面
│   │   └── batch/             # 批量处理页面
│   └── components/             # React 组件
├── scripts/                    # Python 处理脚本
├── knowledge_data/            # 原始 PDF 文档目录
├── processed_knowledge_base/  # 处理后的知识库
├── temp_files/               # 临时文件和处理结果
└── archive/                  # 归档文件
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

## 🛠️ 技术栈

### 前端
- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

### 后端处理
- **Python** - 主要处理语言
- **PyMuPDF (fitz)** - PDF 处理
- **Requests** - API 调用
- **Pillow** - 图像处理

### API 服务
- **SiliconFlow API** - OCR 识别服务
- **Qwen2.5-VL-72B-Instruct** - 视觉语言模型

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

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系维护者。

---

**注意**：本项目专门用于处理倪海夏中医相关文档，OCR 识别效果可能因文档质量而异。建议使用高质量的 PDF 文档以获得最佳识别效果。
