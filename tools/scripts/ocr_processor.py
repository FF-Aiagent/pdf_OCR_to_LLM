#!/usr/bin/env python3
import sys
import json
import os
import base64
import requests
import fitz  # PyMuPDF
from PIL import Image
from io import BytesIO
from datetime import datetime
import time

def process_pdf_ocr(pdf_path, original_filename):
    """
    处理单个PDF文件的OCR识别
    """
    try:
        # 从环境变量获取API密钥
        API_KEY = os.getenv('SILICONFLOW_API_KEY', 'sk-qnczgrftmuzuyhyfdroapmqqqnefqpvbwtjikrnlbzbimpkw')
        MODEL = "Qwen/Qwen2.5-VL-72B-Instruct"
        
        # 打开PDF文档
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        
        # 输出进度信息到stderr，不影响JSON输出
        print(f"开始处理PDF: {original_filename}, 总页数: {total_pages}", file=sys.stderr)
        
        result = {
            "success": True,
            "document_info": {
                "filename": original_filename,
                "total_pages": total_pages,
                "processed_date": datetime.now().isoformat(),
                "model": MODEL
            },
            "pages": [],
            "full_content": "",
            "stats": {
                "total_characters": 0,
                "processing_time": 0,
                "successful_pages": 0,
                "failed_pages": 0
            }
        }
        
        start_time = datetime.now()
        
        for page_num in range(total_pages):
            try:
                print(f"处理第 {page_num + 1}/{total_pages} 页...", file=sys.stderr)
                
                # 获取页面
                page = doc[page_num]
                
                # 转换为图片 (2倍分辨率提高识别质量)
                pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))
                img_data = pix.tobytes("png")
                
                # 使用PIL处理图片
                pil_img = Image.open(BytesIO(img_data))
                buffer = BytesIO()
                pil_img.save(buffer, format="PNG")
                
                # 转换为base64
                img_base64 = base64.b64encode(buffer.getvalue()).decode()
                
                # 准备API请求
                payload = {
                    "model": MODEL,
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "请识别图片中的所有中文文字，保持原有格式和布局，直接输出文字内容："
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/png;base64,{img_base64}"
                                    }
                                }
                            ]
                        }
                    ],
                    "max_tokens": 4000,
                    "temperature": 0.1
                }
                
                # 重试机制
                max_retries = 3
                retry_count = 0
                success = False
                
                while retry_count < max_retries and not success:
                    try:
                        # 调用OCR API
                        headers = {
                            "Authorization": f"Bearer {API_KEY}",
                            "Content-Type": "application/json"
                        }
                        
                        print(f"  调用API (尝试 {retry_count + 1}/{max_retries})...", file=sys.stderr)
                        
                        response = requests.post(
                            "https://api.siliconflow.cn/v1/chat/completions",
                            headers=headers,
                            json=payload,
                            timeout=120  # 增加超时时间
                        )
                        
                        if response.status_code == 200:
                            response_data = response.json()
                            content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")
                            
                            page_result = {
                                "page_number": page_num + 1,
                                "content": content,
                                "characters": len(content)
                            }
                            
                            result["pages"].append(page_result)
                            result["full_content"] += f"\n\n=== 第{page_num + 1}页 ===\n{content}"
                            result["stats"]["total_characters"] += len(content)
                            result["stats"]["successful_pages"] += 1
                            
                            print(f"  ✅ 第{page_num + 1}页处理成功，识别字符数: {len(content)}", file=sys.stderr)
                            success = True
                            
                        elif response.status_code == 429:
                            # 速率限制，等待更长时间
                            print(f"  ⚠️ API速率限制，等待30秒后重试...", file=sys.stderr)
                            time.sleep(30)
                            retry_count += 1
                            
                        else:
                            print(f"  ❌ API调用失败: HTTP {response.status_code}", file=sys.stderr)
                            print(f"  响应内容: {response.text}", file=sys.stderr)
                            retry_count += 1
                            if retry_count < max_retries:
                                time.sleep(5)  # 等待5秒后重试
                    
                    except requests.exceptions.Timeout:
                        print(f"  ⚠️ API调用超时，重试中...", file=sys.stderr)
                        retry_count += 1
                        if retry_count < max_retries:
                            time.sleep(10)
                    
                    except Exception as api_error:
                        print(f"  ❌ API调用出错: {str(api_error)}", file=sys.stderr)
                        retry_count += 1
                        if retry_count < max_retries:
                            time.sleep(5)
                
                # 如果重试失败，记录错误
                if not success:
                    error_content = f"第{page_num + 1}页OCR识别失败: 多次重试后仍无法处理"
                    result["pages"].append({
                        "page_number": page_num + 1,
                        "content": error_content,
                        "characters": 0,
                        "error": True
                    })
                    result["full_content"] += f"\n\n=== 第{page_num + 1}页 ===\n{error_content}"
                    result["stats"]["failed_pages"] += 1
                    print(f"  ❌ 第{page_num + 1}页最终处理失败", file=sys.stderr)
                
                # 在处理下一页之前添加延迟，避免API速率限制
                if page_num < total_pages - 1:  # 不是最后一页
                    delay = 3  # 增加到3秒延迟
                    print(f"  等待 {delay} 秒后处理下一页...", file=sys.stderr)
                    time.sleep(delay)
                
            except Exception as page_error:
                # 单页处理失败
                error_content = f"第{page_num + 1}页处理出错: {str(page_error)}"
                result["pages"].append({
                    "page_number": page_num + 1,
                    "content": error_content,
                    "characters": 0,
                    "error": True
                })
                result["full_content"] += f"\n\n=== 第{page_num + 1}页 ===\n{error_content}"
                result["stats"]["failed_pages"] += 1
                print(f"  ❌ 第{page_num + 1}页处理异常: {str(page_error)}", file=sys.stderr)
        
        # 关闭文档
        doc.close()
        
        # 计算处理时间
        end_time = datetime.now()
        result["stats"]["processing_time"] = (end_time - start_time).total_seconds()
        result["full_content"] = result["full_content"].strip()
        
        print(f"处理完成! 成功: {result['stats']['successful_pages']}, 失败: {result['stats']['failed_pages']}", file=sys.stderr)
        
        return result
        
    except Exception as e:
        print(f"PDF处理失败: {str(e)}", file=sys.stderr)
        return {
            "success": False,
            "error": f"PDF处理失败: {str(e)}",
            "filename": original_filename
        }

def main():
    if len(sys.argv) != 3:
        print(json.dumps({
            "success": False,
            "error": "用法: python ocr_processor.py <pdf_path> <original_filename>"
        }, ensure_ascii=False))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    original_filename = sys.argv[2]
    
    if not os.path.exists(pdf_path):
        print(json.dumps({
            "success": False,
            "error": f"文件不存在: {pdf_path}"
        }, ensure_ascii=False))
        sys.exit(1)
    
    # 处理OCR
    result = process_pdf_ocr(pdf_path, original_filename)
    
    # 输出JSON结果到stdout
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main() 