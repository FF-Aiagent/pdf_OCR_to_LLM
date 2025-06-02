#!/usr/bin/env python3
import os

def create_simple_pdf():
    """创建一个简单的测试PDF文件"""
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        
        # 检查是否有中文字体
        try:
            font_path = '/System/Library/Fonts/STHeiti Light.ttc'  # macOS系统字体
            if os.path.exists(font_path):
                pdfmetrics.registerFont(TTFont('chinese', font_path))
                font_name = 'chinese'
            else:
                font_name = 'Helvetica'
        except:
            font_name = 'Helvetica'

        # 创建PDF
        c = canvas.Canvas('test_pdf.pdf', pagesize=letter)
        c.setFont(font_name, 16)

        # 添加测试文本
        if font_name == 'chinese':
            test_text = [
                '测试PDF文档',
                '',
                '这是一个用于测试OCR功能的简单文档。',
                '包含中文文字内容，用于验证AI OCR识别系统。',
                '',
                '倪海厦中医理论相关内容：',
                '- 天纪系列：天机道、人间道、地脉道',
                '- 人纪系列：伤寒论、金匮要略、神农本草经',
                '- 针灸教程和医案集',
                '',
                '这个系统可以将PDF转换为结构化知识库。'
            ]
        else:
            test_text = [
                'Test PDF Document',
                '',
                'This is a simple document for testing OCR functionality.',
                'Contains text content to verify AI OCR recognition system.',
                '',
                'TCM Related Content:',
                '- Tianji Series',
                '- Renji Series', 
                '- Acupuncture and Medical Cases',
                '',
                'This system converts PDF to structured knowledge base.'
            ]

        y = 750
        for line in test_text:
            c.drawString(100, y, line)
            y -= 25

        c.save()
        print('测试PDF文件已创建: test_pdf.pdf')
        return True
        
    except ImportError:
        print('reportlab库未安装，使用简单方法创建测试文件')
        # 创建一个简单的文本文件，稍后可以手动转换
        with open('test_content.txt', 'w', encoding='utf-8') as f:
            f.write("""测试PDF文档

这是一个用于测试OCR功能的简单文档。
包含中文文字内容，用于验证AI OCR识别系统。

倪海厦中医理论相关内容：
- 天纪系列：天机道、人间道、地脉道
- 人纪系列：伤寒论、金匮要略、神农本草经
- 针灸教程和医案集

这个系统可以将PDF转换为结构化知识库。""")
        print('已创建测试文本文件: test_content.txt')
        print('请手动将此文本转换为PDF，或下载一个测试PDF文件')
        return False

if __name__ == "__main__":
    create_simple_pdf() 