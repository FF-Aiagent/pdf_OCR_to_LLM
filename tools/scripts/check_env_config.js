#!/usr/bin/env node

/**
 * 环境变量配置检查脚本
 * 用于诊断OCR功能的环境配置问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始检查项目环境配置...\n');

// 检查必需的环境变量
const requiredEnvVars = [
  'SILICONFLOW_API_KEY',
  'SILICONFLOW_BASE_URL', 
  'SILICONFLOW_MODEL'
];

const optionalEnvVars = [
  'DEEPSEEK_API_KEY',
  'OPENAI_API_KEY',
  'NODE_ENV'
];

function checkEnvironmentVariables() {
  console.log('📋 检查环境变量...');
  
  let hasErrors = false;
  
  // 检查必需变量
  console.log('\n✅ 必需环境变量:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName === 'SILICONFLOW_API_KEY') {
        const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
        console.log(`  ✓ ${varName}: ${masked}`);
      } else {
        console.log(`  ✓ ${varName}: ${value}`);
      }
    } else {
      console.log(`  ❌ ${varName}: 未设置`);
      hasErrors = true;
    }
  });

  // 检查可选变量
  console.log('\n📋 可选环境变量:');
  optionalEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName.includes('API_KEY')) {
        const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
        console.log(`  ✓ ${varName}: ${masked}`);
      } else {
        console.log(`  ✓ ${varName}: ${value}`);
      }
    } else {
      console.log(`  - ${varName}: 未设置 (可选)`);
    }
  });

  return !hasErrors;
}

function checkConfigFiles() {
  console.log('\n📁 检查配置文件...');
  
  const configFiles = [
    'package.json',
    'next.config.mjs',
    'vercel.json',
    '.nvmrc',
    'env.example'
  ];

  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✓ ${file}: 存在`);
    } else {
      console.log(`  ❌ ${file}: 不存在`);
    }
  });
}

function checkAPIRoute() {
  console.log('\n🛠️ 检查API路由...');
  
  const apiRoute = 'src/app/api/ocr/route.ts';
  if (fs.existsSync(apiRoute)) {
    console.log(`  ✓ ${apiRoute}: 存在`);
    
    // 检查API文件内容
    const content = fs.readFileSync(apiRoute, 'utf8');
    
    if (content.includes('process.env.SILICONFLOW_API_KEY')) {
      console.log(`  ✓ 正确使用环境变量`);
    } else {
      console.log(`  ⚠️ 可能硬编码了API密钥`);
    }
    
    if (content.includes('fetch(')) {
      console.log(`  ✓ 包含网络请求代码`);
    }
    
    if (content.includes('error')) {
      console.log(`  ✓ 包含错误处理`);
    }
  } else {
    console.log(`  ❌ ${apiRoute}: 不存在`);
  }
}

function generateEnvTemplate() {
  console.log('\n📝 生成环境变量模板...');
  
  const template = `# 🔧 Vercel环境变量配置模板
# 复制以下内容到 Vercel Dashboard → Settings → Environment Variables

# 必需配置
SILICONFLOW_API_KEY=sk-your-actual-api-key-here
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen2.5-VL-72B-Instruct

# 可选配置
NODE_ENV=production

# 配置说明:
# 1. 登录 https://vercel.com/dashboard
# 2. 选择项目 pdf_OCR_to_LLM
# 3. 进入 Settings → Environment Variables
# 4. 添加上述变量，每个变量一行
# 5. 设置完成后重新部署项目

# 获取API密钥:
# 访问 https://www.siliconflow.cn
# 注册并登录后在控制台创建API密钥
`;

  fs.writeFileSync('vercel-env-template.txt', template);
  console.log('  ✓ 已生成 vercel-env-template.txt');
}

function displayTroubleshootingSteps() {
  console.log('\n🚑 故障排除步骤:');
  console.log('');
  console.log('1️⃣ 检查Vercel环境变量:');
  console.log('   - 访问 https://vercel.com/dashboard');
  console.log('   - 选择项目 → Settings → Environment Variables');
  console.log('   - 确认 SILICONFLOW_API_KEY 已设置');
  console.log('');
  console.log('2️⃣ 获取API密钥:');
  console.log('   - 访问 https://www.siliconflow.cn');
  console.log('   - 注册账号并创建API密钥');
  console.log('   - 密钥格式: sk-xxxxxxxxx');
  console.log('');
  console.log('3️⃣ 重新部署:');
  console.log('   - 在Vercel中进入 Deployments');
  console.log('   - 点击最新部署的 "..." → Redeploy');
  console.log('');
  console.log('4️⃣ 测试功能:');
  console.log('   - 访问网站OCR页面');
  console.log('   - 上传小文件测试 (<2MB)');
  console.log('   - 查看浏览器控制台错误信息');
}

function displayQuickFix() {
  console.log('\n⚡ 快速修复指南:');
  console.log('');
  console.log('如果遇到 "网络连接错误":');
  console.log('  1. 首先检查环境变量是否设置');
  console.log('  2. 确认API密钥格式正确');
  console.log('  3. 在Vercel中重新部署项目');
  console.log('  4. 等待2-3分钟后重试');
  console.log('');
  console.log('如果仍有问题:');
  console.log('  1. 按F12打开浏览器开发者工具');
  console.log('  2. 查看Console和Network标签页的错误');
  console.log('  3. 参考 docs/TROUBLESHOOTING.md 详细指南');
}

// 主函数
function main() {
  const envOk = checkEnvironmentVariables();
  checkConfigFiles();
  checkAPIRoute();
  generateEnvTemplate();
  
  console.log('\n' + '='.repeat(50));
  
  if (envOk) {
    console.log('✅ 环境配置检查通过!');
    console.log('如果仍有问题，请检查Vercel中的环境变量设置。');
  } else {
    console.log('❌ 发现配置问题!');
    displayTroubleshootingSteps();
  }
  
  displayQuickFix();
  
  console.log('\n📚 完整故障排除指南: docs/TROUBLESHOOTING.md');
  console.log('📝 Vercel配置模板: vercel-env-template.txt');
}

// 运行检查
main(); 