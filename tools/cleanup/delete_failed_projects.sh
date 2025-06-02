#!/bin/bash

# Vercel项目批量删除脚本
# 使用前请先运行: chmod +x delete_failed_projects.sh

echo "🗑️  批量删除Vercel失败项目脚本"
echo "================================="

# 要删除的项目名称列表（请根据实际情况修改）
FAILED_PROJECTS=(
    "pdf-ocr-to-llm-git-clone-1"
    "pdf-ocr-to-llm-git-clone-2"
    "pdf-ocr-to-llm-git-clone-3"
    # 添加更多失败的项目名称...
)

echo "准备删除以下项目："
for project in "${FAILED_PROJECTS[@]}"; do
    echo "  - $project"
done

echo ""
read -p "确认删除以上项目？(y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    for project in "${FAILED_PROJECTS[@]}"; do
        echo "正在删除项目: $project"
        vercel projects remove "$project" --confirm
        
        if [ $? -eq 0 ]; then
            echo "✅ 成功删除: $project"
        else
            echo "❌ 删除失败: $project"
        fi
        echo ""
    done
    echo "🎉 批量删除完成！"
else
    echo "❌ 取消删除操作"
fi 