// Vercel Dashboard 批量删除脚本
// 在Vercel控制台页面按F12打开开发者工具，在Console中粘贴并执行此脚本

(function() {
    console.log('🚀 Vercel项目批量删除脚本启动');
    
    // 配置要删除的项目名称模式（支持正则表达式）
    const PROJECT_PATTERNS = [
        /pdf.*ocr.*git.*clone/i,  // 匹配包含"pdf"、"ocr"、"git"、"clone"的项目
        /failed.*build/i,         // 匹配包含"failed"、"build"的项目
        // 添加更多模式...
    ];
    
    // 或者直接指定项目名称列表
    const SPECIFIC_PROJECTS = [
        'pdf-ocr-to-llm-git-clone-1',
        'pdf-ocr-to-llm-git-clone-2',
        'pdf-ocr-to-llm-git-clone-3',
        // 添加更多具体项目名称...
    ];
    
    function findProjectElements() {
        // 查找所有项目元素（根据Vercel界面结构）
        const projectElements = document.querySelectorAll('[data-testid="project-item"], .project-item, [data-project-name]');
        return Array.from(projectElements);
    }
    
    function getProjectName(element) {
        // 尝试多种方式获取项目名称
        const nameSelectors = [
            'h3', 'h4', '.project-name', '[data-project-name]',
            'a[href*="/"]', '.font-semibold'
        ];
        
        for (const selector of nameSelectors) {
            const nameElement = element.querySelector(selector);
            if (nameElement) {
                return nameElement.textContent.trim();
            }
        }
        
        return element.textContent.trim().split('\n')[0];
    }
    
    function shouldDeleteProject(projectName) {
        // 检查是否在具体项目列表中
        if (SPECIFIC_PROJECTS.includes(projectName)) {
            return true;
        }
        
        // 检查是否匹配模式
        return PROJECT_PATTERNS.some(pattern => pattern.test(projectName));
    }
    
    function findDeleteButton(projectElement) {
        // 查找删除按钮
        const deleteSelectors = [
            'button[aria-label*="delete"]',
            'button[title*="delete"]',
            '.delete-button',
            'button:has(svg[data-testid="trash"])',
            'button:has([data-icon="trash"])'
        ];
        
        for (const selector of deleteSelectors) {
            const button = projectElement.querySelector(selector);
            if (button) return button;
        }
        
        // 查找设置菜单
        const menuButton = projectElement.querySelector('button[aria-label*="menu"], button[title*="menu"], .menu-button');
        return menuButton;
    }
    
    async function deleteProject(projectElement, projectName) {
        console.log(`🗑️ 准备删除项目: ${projectName}`);
        
        const deleteButton = findDeleteButton(projectElement);
        if (!deleteButton) {
            console.error(`❌ 未找到删除按钮: ${projectName}`);
            return false;
        }
        
        try {
            // 点击删除按钮
            deleteButton.click();
            
            // 等待确认对话框
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 查找并点击确认按钮
            const confirmButton = document.querySelector(
                'button[data-testid="confirm-delete"], ' +
                'button:contains("Delete"), ' +
                'button:contains("确认"), ' +
                '.confirm-button, ' +
                '[role="dialog"] button[data-variant="danger"]'
            );
            
            if (confirmButton) {
                confirmButton.click();
                console.log(`✅ 成功删除: ${projectName}`);
                return true;
            } else {
                console.error(`❌ 未找到确认按钮: ${projectName}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ 删除失败: ${projectName}`, error);
            return false;
        }
    }
    
    async function batchDelete() {
        const projectElements = findProjectElements();
        console.log(`📋 找到 ${projectElements.length} 个项目`);
        
        const toDelete = [];
        
        for (const element of projectElements) {
            const projectName = getProjectName(element);
            if (shouldDeleteProject(projectName)) {
                toDelete.push({ element, name: projectName });
            }
        }
        
        console.log(`🎯 识别到 ${toDelete.length} 个需要删除的项目:`);
        toDelete.forEach(({ name }) => console.log(`  - ${name}`));
        
        if (toDelete.length === 0) {
            console.log('ℹ️ 没有找到匹配的项目需要删除');
            return;
        }
        
        const confirmed = confirm(`确认删除 ${toDelete.length} 个项目吗？`);
        if (!confirmed) {
            console.log('❌ 用户取消删除操作');
            return;
        }
        
        let successCount = 0;
        for (const { element, name } of toDelete) {
            const success = await deleteProject(element, name);
            if (success) successCount++;
            
            // 延迟避免过快操作
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`🎉 批量删除完成! 成功删除 ${successCount}/${toDelete.length} 个项目`);
    }
    
    // 执行批量删除
    batchDelete().catch(error => {
        console.error('❌ 批量删除过程中出现错误:', error);
    });
})(); 