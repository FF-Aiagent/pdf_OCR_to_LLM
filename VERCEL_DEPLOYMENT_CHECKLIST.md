# Vercel部署检查清单 ✅

在将项目部署到Vercel之前，请确保所有配置都已正确设置。

## 🚀 部署前检查

### 1. 项目文件结构
- [ ] `package.json` 包含所有必要的脚本和依赖
- [ ] `next.config.mjs` 配置正确
- [ ] `vercel.json` 部署配置完整
- [ ] `.nvmrc` 指定Node.js版本
- [ ] `tsconfig.json` TypeScript配置正确

### 2. 环境变量准备
- [ ] 拥有有效的SiliconFlow API密钥
- [ ] 环境变量名称正确（见env.example）
- [ ] 所有必需的环境变量都已准备

### 3. 代码质量
- [ ] 所有TypeScript错误已修复
- [ ] ESLint检查通过
- [ ] 构建测试成功 (`npm run build`)

## 📋 Vercel部署步骤

### 第一步：GitHub仓库准备
1. 确保代码已推送到GitHub
2. 仓库是公开的或你有权限访问
3. main分支包含最新代码

### 第二步：Vercel项目创建
1. 登录 [Vercel仪表板](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择GitHub仓库
4. Vercel自动检测为Next.js项目

### 第三步：环境变量配置
在Vercel项目设置中添加以下环境变量：

```bash
# 必需变量
SILICONFLOW_API_KEY=sk-your-api-key-here
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen2.5-VL-72B-Instruct

# 应用配置
NEXT_PUBLIC_APP_NAME=AI OCR知识库处理系统
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_AI_MODEL=Qwen/Qwen2.5-VL-72B-Instruct

# 文件处理配置
MAX_FILE_SIZE=10MB
UPLOAD_DIR=uploads
TEMP_DIR=temp_files
KNOWLEDGE_DATA_DIR=knowledge_data
```

### 第四步：部署设置
- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] Development Command: `npm run dev`

### 第五步：启动部署
1. 检查所有配置无误
2. 点击 "Deploy"
3. 等待构建完成（通常2-5分钟）

## 🔍 部署后验证

### 1. 基础功能测试
访问部署的域名，确认：
- [ ] 首页正确显示"AI OCR知识库处理系统"
- [ ] 导航菜单正常工作
- [ ] 页面样式正确加载
- [ ] 移动端显示正常

### 2. 核心功能测试
- [ ] OCR页面可以访问
- [ ] 知识库页面正常显示
- [ ] 批量处理页面加载成功
- [ ] API端点响应正常

### 3. 错误检查
在Vercel仪表板Functions选项卡中：
- [ ] 没有构建错误
- [ ] 函数调用正常
- [ ] 没有运行时错误

## 🛠️ 常见问题解决

### 构建失败
```bash
Error: Cannot find module 'next'
```
**解决方法**: 确保package.json中包含next依赖

### API调用失败
```bash
Error: API key not found
```
**解决方法**: 检查环境变量设置是否正确

### 函数超时
```bash
Error: Function execution timed out
```
**解决方法**: 在vercel.json中增加maxDuration

### 内存超限
```bash
Error: Function exceeded memory limit
```
**解决方法**: 优化代码或升级Vercel计划

## 📊 性能优化建议

### 1. 构建优化
- 启用Next.js构建缓存
- 使用动态导入减少包大小
- 优化图像和静态资源

### 2. 运行时优化
- 设置适当的API超时时间
- 使用Vercel Edge Functions处理轻量任务
- 启用增量静态生成(ISR)

### 3. 用户体验优化
- 添加加载状态指示器
- 实现错误边界
- 优化首次加载时间

## 🎯 部署成功标志

当看到以下内容时，说明部署成功：
- ✅ Vercel构建日志显示"Build Completed"
- ✅ 域名可以正常访问
- ✅ 所有页面都能正确加载
- ✅ API功能正常工作
- ✅ 没有控制台错误

## 📞 获取帮助

如果遇到部署问题：
1. 查看Vercel构建日志
2. 检查GitHub仓库Issues
3. 参考Vercel官方文档
4. 在项目仓库提交Issue

---

**祝你部署成功！🎉** 