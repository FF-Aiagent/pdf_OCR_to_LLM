# AI OCR 知识库处理系统

## 项目概述
基于 SiliconFlow API 的 PDF OCR 识别系统，专门用于将倪海夏中医文档转换为 AI 可调用的结构化知识库。

## 核心功能
1. **PDF 转图片处理**：使用 PyMuPDF 将 PDF 页面转换为高质量图片
2. **AI OCR 识别**：调用 SiliconFlow 的 Qwen2.5-VL-72B-Instruct 模型进行 OCR
3. **知识库结构化**：自动分类和格式化为 JSON 格式
4. **批量处理**：支持大规模 PDF 文档的自动化处理

## 主要文件结构
```
├── knowledge_data/          # 原始PDF文档存储
├── processed_knowledge_base/ # 处理后的知识库
├── scripts/                 # 核心处理脚本
│   ├── pdf_ocr_processor.py # 主要处理脚本
│   └── requirements.txt     # Python依赖
├── src/                     # Next.js 前端界面
├── process_complete.py      # 完整处理脚本示例
└── env.example             # 环境变量模板
```

## 技术栈
- **Python**: PyMuPDF, requests
- **API**: SiliconFlow Qwen2.5-VL-72B-Instruct
- **前端**: Next.js, TypeScript, Tailwind CSS
- **输出格式**: JSON, TXT

## 特色功能
- **智能分类**：自动识别天机、人纪、针灸、中药等分类
- **容错处理**：网络重试、错误恢复机制
- **进度跟踪**：实时处理状态监控
- **批量高效**：支持 64+ PDF 文档并发处理

## 使用场景
适用于中医文献数字化、知识图谱构建、AI 问答系统的知识库准备等应用场景。 