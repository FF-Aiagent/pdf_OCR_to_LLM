# 项目文件结构

## 📁 核心目录结构
```
ai_predict/
├── 📂 src/                     # Next.js 源代码
│   ├── app/                    # App Router 页面
│   ├── components/             # React 组件
│   └── lib/                    # 工具库
├── 📂 scripts/                 # 核心处理脚本
├── 📂 knowledge_data/          # PDF 文档存储
├── 📂 public/                  # 静态资源
├── 📂 examples/                # 示例文件和配置
├── 📂 docs/                    # 项目文档
├── 📂 temp_files/              # 临时文件
│   ├── results/                # 处理结果
│   ├── logs/                   # 日志文件
│   └── images/                 # 图片文件
├── 📂 archive/                 # 归档文件
│   ├── old_scripts/            # 旧脚本
│   └── test_files/             # 测试文件
├── 📄 README.md                # 项目说明
├── 📄 README_CORE.md           # 核心功能说明
├── 📄 package.json             # Node.js 依赖
├── 📄 tsconfig.json            # TypeScript 配置
└── 📄 .gitignore               # Git 忽略规则
```

## 🔧 核心文件说明

### Python 脚本
- `process_complete.py` - 完整的PDF处理脚本
- `simple_ocr.py` - 简单OCR识别脚本
- `multi_test.py` - 多功能测试脚本

### 配置文件
- `package.json` - Node.js项目配置
- `tsconfig.json` - TypeScript配置
- `next.config.ts` - Next.js配置
- `tailwind.config.ts` - Tailwind CSS配置

### 文档
- `README.md` - 项目主要说明
- `README_CORE.md` - 核心功能详细说明

## 🗂️ 文件分类说明

### temp_files/ - 临时文件
- `results/` - OCR处理结果文件
- `logs/` - 运行日志和状态文件
- `images/` - 生成的图片文件

### examples/ - 示例和配置
- V0相关的示例组件
- 部署配置文件
- 示例数据文件

### archive/ - 归档文件
- `old_scripts/` - 旧版本的处理脚本
- `test_files/` - 测试用文件

## 🚀 使用建议
1. 开发时主要关注 `src/` 和 `scripts/` 目录
2. 临时文件会自动存放在 `temp_files/` 中
3. 示例和配置文件在 `examples/` 中查看
4. 归档文件可以定期清理
