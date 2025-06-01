# GitHub 默认分支设置指导 🔧

## 🎯 问题诊断

当前GitHub仓库的默认分支是 `clean-core`，但我们希望使用 `main` 分支作为默认分支，因为它包含了最新的完整修正。

## 📋 当前状态

- **仓库地址**: https://github.com/FF-Aiagent/pdf_OCR_to_LLM
- **当前默认分支**: `clean-core` ❌
- **期望默认分支**: `main` ✅
- **两个分支都已同步**: ✅ (最新提交: 974179b)

## 🔧 解决方案

### 方式1: 在GitHub网站上修改（推荐）

1. **访问仓库设置**：
   - 打开 https://github.com/FF-Aiagent/pdf_OCR_to_LLM
   - 点击 "Settings" 选项卡

2. **修改默认分支**：
   - 在左侧菜单找到 "General"
   - 滚动到 "Default branch" 部分
   - 点击分支名称旁边的 ↔️ 图标
   - 选择 `main` 分支
   - 点击 "Update" 按钮
   - 确认更改

3. **验证更改**：
   - 返回仓库主页
   - 确认显示的是 `main` 分支
   - 页面应该显示正确的AI OCR系统内容

### 方式2: 使用GitHub CLI（如果已安装）

```bash
# 设置默认分支为main
gh repo edit FF-Aiagent/pdf_OCR_to_LLM --default-branch main
```

## 🚀 验证步骤

设置完成后，请验证以下内容：

### ✅ GitHub页面验证
- [ ] 仓库主页显示 `main` 分支
- [ ] README.md显示 "AI OCR 知识库处理系统"
- [ ] package.json显示项目名称为 "ai-ocr-knowledge-base"

### ✅ 文件内容验证
- [ ] `src/app/page.tsx` - AI OCR知识库处理系统主页
- [ ] `src/app/ocr/page.tsx` - 单文档OCR识别功能
- [ ] `src/app/knowledge/page.tsx` - 知识库浏览界面
- [ ] `src/app/batch/page.tsx` - 批量处理功能

## 🌐 部署测试

默认分支设置完成后：

1. **Bolt.new导入测试**：
   ```
   导入链接: https://github.com/FF-Aiagent/pdf_OCR_to_LLM
   ```
   - 应该自动导入 `main` 分支
   - 显示正确的AI OCR系统界面

2. **Vercel部署测试**：
   - 连接GitHub仓库
   - 应该自动检测 `main` 分支
   - 部署正确的Next.js应用

## 🔍 故障排除

如果仍然显示错误内容：

1. **清除缓存**：
   - 在bolt.new中重新导入
   - 或者等待几分钟让GitHub更新

2. **手动指定分支**：
   - 在导入时明确指定 `main` 分支
   - 使用完整路径: `https://github.com/FF-Aiagent/pdf_OCR_to_LLM/tree/main`

3. **检查分支内容**：
   - 访问 https://github.com/FF-Aiagent/pdf_OCR_to_LLM/tree/main
   - 确认看到正确的文件内容

## 📊 分支对比

| 分支 | 状态 | 内容 | 建议 |
|------|------|------|------|
| `main` | ✅ 最新 | AI OCR知识库处理系统 | 推荐使用 |
| `clean-core` | ✅ 已同步 | 相同内容 | 可以保留或删除 |

## 🎉 完成确认

设置完成后，以下内容应该正常工作：

✅ **GitHub仓库**: 默认显示main分支和AI OCR系统  
✅ **Bolt.new导入**: 自动获取正确的代码  
✅ **其他平台部署**: 都能正确识别项目类型  

---

**下一步**: 完成默认分支设置后，重新在bolt.new中导入GitHub仓库即可看到正确的AI OCR知识库处理系统界面。 