import fitz, base64, requests, json, os, time; from io import BytesIO; from PIL import Image; from datetime import datetime; pdf_path="knowledge_data/【04】《天纪》《人纪》原版影印版文档/倪海厦《天纪》.pdf"; API_KEY="sk-qnczgrftmuzuyhyfdroapmqqqnefqpvbwtjikrnlbzbimpkw"; MODEL="Qwen/Qwen2.5-VL-72B-Instruct"; doc=fitz.open(pdf_path); total_pages=len(doc); doc.close(); print(f"🚀 开始处理倪海厦《天纪》.pdf - {total_pages}页"); kb={"document":{"filename":os.path.basename(pdf_path),"total_pages":total_pages,"model":MODEL,"processed_date":datetime.now().isoformat()},"pages":[],"full_content":"","stats":{"success":0,"failed":0,"total_chars":0}}; start_time=time.time(); [print(f"
[{i+1}/{total_pages}] 处理第{i+1}页") or exec("doc=fitz.open(pdf_path); page=doc[i]; pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5)); img_data=pix.tobytes(\"png\"); pil_img=Image.open(BytesIO(img_data)); buffer=BytesIO(); pil_img.save(buffer,format=\"PNG\"); b64=base64.b64encode(buffer.getvalue()).decode(); doc.close(); data={\"model\":MODEL,\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"请识别图片中的所有中文文字内容，完整准确地提取出来，保持原有的格式和结构。如果有表格，请尽量保持表格结构。\"},{\"type\":\"image_url\",\"image_url\":{\"url\":f\"data:image/png;base64,{b64}\"}}]}],\"max_tokens\":4000,\"temperature\":0.1}; r=requests.post(\"https://api.siliconflow.cn/v1/chat/completions\",headers={\"Authorization\":\"Bearer \"+API_KEY,\"Content-Type\":\"application/json\"},json=data,timeout=60); content=r.json().get(\"choices\",[{}])[0].get(\"message\",{}).get(\"content\",\"\"); kb[\"pages\"].append({\"page\":i+1,\"content\":content,\"chars\":len(content)}); kb[\"stats\"][\"success\"]+=1; kb[\"stats\"][\"total_chars\"]+=len(content); kb[\"full_content\"]+=f\"

=== 第{i+1}页 ===
{content}\"; print(f\"  ✅ 成功 {len(content)}字符\"); time.sleep(2) if i<total_pages-1 else None") for i in range(total_pages)]; kb["stats"]["processing_time"]=round(time.time()-start_time,2); kb["full_content"]=kb["full_content"].strip(); os.makedirs("processed_knowledge_base/by_document", exist_ok=True); json.dump(kb,open("processed_knowledge_base/by_document/倪海厦天纪_完整知识库.json","w",encoding="utf-8"),ensure_ascii=False,indent=2); open("processed_knowledge_base/by_document/倪海厦天纪_完整知识库.txt","w",encoding="utf-8").write(f"倪海厦《天纪》.pdf - AI知识库
处理时间: {datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")}
总字符数: {kb[\"stats\"][\"total_chars\"]}
总页数: {total_pages}
成功: {kb[\"stats\"][\"success\"]}
用时: {kb[\"stats\"][\"processing_time\"]}秒

{\"=\"*80}

{kb[\"full_content\"]}"); print(f"
🎉 处理完成! 总字符数: {kb[\"stats\"][\"total_chars\"]}, 用时: {kb[\"stats\"][\"processing_time\"]}秒
💾 文件: processed_knowledge_base/by_document/倪海厦天纪_完整知识库.json")
