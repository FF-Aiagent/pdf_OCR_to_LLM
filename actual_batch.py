print("开始批量处理所有PDF文件...")
import fitz, base64, requests, json, os, time, re
from io import BytesIO
from PIL import Image
from datetime import datetime
API_KEY = "sk-qnczgrftmuzuyhyfdroapmqqqnefqpvbwtjikrnlbzbimpkw"
MODEL = "Qwen/Qwen2.5-VL-72B-Instruct"
pdf_files = [os.path.join(root, file) for root, dirs, files in os.walk("knowledge_data") for file in files if file.lower().endswith(".pdf")]
print(f"发现 {len(pdf_files)} 个PDF文件")
