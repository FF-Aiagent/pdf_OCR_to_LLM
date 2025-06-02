# 🔧 故障排除指南

## 常见问题和解决方案

### 🚨 OCR处理报错：网络连接错误

#### 问题描述
上传PDF进行OCR识别时，出现"网络连接错误"或"服务配置错误"提示。

#### 可能原因
1. **环境变量未配置** - 最常见原因
2. **API密钥无效或过期**
3. **网络连接问题**
4. **API配额用完**

#### 解决步骤

##### 🔑 步骤1：检查Vercel环境变量配置

**在Vercel Dashboard中：**

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `pdf_OCR_to_LLM`
3. 进入 **Settings** → **Environment Variables**
4. 确认以下环境变量已正确设置：

```bash
# 必需的环境变量
SILICONFLOW_API_KEY=sk-your-actual-api-key-here
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1  
SILICONFLOW_MODEL=Qwen/Qwen2.5-VL-72B-Instruct
```

**注意事项：**
- 环境变量名称必须完全一致（区分大小写）
- API密钥以 `sk-` 开头
- 设置后需要重新部署项目

##### 📋 步骤2：获取SiliconFlow API密钥

如果你还没有API密钥：

1. 访问 [SiliconFlow官网](https://www.siliconflow.cn)
2. 注册账号并登录
3. 进入控制台 → API密钥管理
4. 创建新的API密钥
5. 复制密钥（以`sk-`开头的字符串）

##### 🔄 步骤3：重新部署项目

在Vercel中设置环境变量后：

1. 进入项目的 **Deployments** 页面
2. 点击最新部署右侧的 **...** 菜单
3. 选择 **Redeploy**
4. 等待重新部署完成

##### 🧪 步骤4：测试API连接

重新部署后，测试OCR功能：

1. 访问你的网站
2. 进入OCR页面
3. 上传一个小的PDF文件（<2MB）
4. 观察处理过程和错误信息

### 📊 错误代码说明

| 错误信息 | 状态码 | 原因 | 解决方法 |
|----------|--------|------|----------|
| 服务配置错误：API密钥未设置 | 500 | 环境变量未配置 | 在Vercel中设置SILICONFLOW_API_KEY |
| API请求失败: 401 Unauthorized | 401 | API密钥无效 | 检查API密钥是否正确 |
| API请求失败: 429 Too Many Requests | 429 | API调用过于频繁 | 等待一段时间后重试 |
| 请求超时 | 408 | 网络超时 | 尝试较小的文件或稍后重试 |
| 网络连接错误 | 503 | 网络问题 | 检查网络连接 |

### 🔍 调试方法

#### 查看详细错误信息

1. 在浏览器中按 `F12` 打开开发者工具
2. 切换到 **Console** 标签页
3. 尝试上传PDF文件
4. 观察控制台中的错误信息

#### 检查网络请求

1. 在开发者工具中切换到 **Network** 标签页
2. 上传文件进行OCR处理
3. 查看 `/api/ocr` 请求的响应状态
4. 检查响应内容中的具体错误信息

### 💡 优化建议

#### 文件大小优化
- 建议PDF文件大小 < 5MB
- 页数建议 < 10页
- 避免包含大量图像的PDF

#### 处理速度优化
- 单页文档处理最快（约30秒）
- 多页文档每页间隔处理（避免API限制）
- 建议分批处理大型文档

#### API配额管理
- 注意API调用次数限制
- 合理规划处理任务
- 必要时升级API套餐

### 🆘 联系支持

如果按照以上步骤仍无法解决问题：

1. **收集错误信息**：
   - 浏览器控制台截图
   - 具体的错误消息
   - 使用的PDF文件信息

2. **检查项目设置**：
   - Vercel环境变量截图
   - 部署日志信息

3. **提交Issue**：
   - 访问 [GitHub Issues](https://github.com/FF-Aiagent/pdf_OCR_to_LLM/issues)
   - 创建新的Issue并提供详细信息

### 📚 相关文档

- [Vercel环境变量配置指南](./deployment/VERCEL_DEPLOYMENT_CHECKLIST.md)
- [SiliconFlow API文档](https://docs.siliconflow.cn/)
- [项目部署完整指南](./deployment/DEPLOYMENT_SUCCESS.md)

---

**常见问题99%都是环境变量配置问题，请首先检查Vercel中的API密钥设置！** ✅ 