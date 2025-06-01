// 本地知识库扫描器
// 用于扫描本地knowledge_data目录中的PDF文件并加载到知识库

import fs from 'fs';
import path from 'path';
import { pdfParser, PDFDocument } from './pdf-parser';

export interface ScanResult {
  success: boolean;
  scannedFiles: string[];
  loadedDocuments: PDFDocument[];
  errors: { file: string; error: string }[];
  stats: {
    totalFiles: number;
    successCount: number;
    errorCount: number;
    totalChunks: number;
  };
}

export class LocalKnowledgeScanner {
  private knowledgeDataPath: string;

  constructor() {
    this.knowledgeDataPath = path.join(process.cwd(), 'knowledge_data');
  }

  /**
   * 扫描本地知识库目录
   */
  async scanLocalKnowledge(): Promise<ScanResult> {
    const result: ScanResult = {
      success: false,
      scannedFiles: [],
      loadedDocuments: [],
      errors: [],
      stats: {
        totalFiles: 0,
        successCount: 0,
        errorCount: 0,
        totalChunks: 0
      }
    };

    try {
      // 检查知识库目录是否存在
      if (!fs.existsSync(this.knowledgeDataPath)) {
        throw new Error(`知识库目录不存在: ${this.knowledgeDataPath}`);
      }

      console.log('开始扫描本地知识库:', this.knowledgeDataPath);

      // 递归扫描所有PDF文件
      const pdfFiles = this.findPDFFiles(this.knowledgeDataPath);
      result.scannedFiles = pdfFiles;
      result.stats.totalFiles = pdfFiles.length;

      console.log(`找到 ${pdfFiles.length} 个PDF文件`);

      // 逐个处理PDF文件
      for (const filePath of pdfFiles) {
        try {
          console.log(`正在处理: ${path.basename(filePath)}`);
          
          // 解析PDF文档
          const document = await pdfParser.parsePDF(filePath);
          
          // 添加到知识库
          pdfParser.addDocument(document);
          
          result.loadedDocuments.push(document);
          result.stats.successCount++;
          result.stats.totalChunks += document.chunks.length;
          
          console.log(`成功加载: ${document.title} (${document.chunks.length} 个知识块)`);
          
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : '未知错误';
          result.errors.push({
            file: path.basename(filePath),
            error: errorMsg
          });
          result.stats.errorCount++;
          console.error(`处理文件失败 ${path.basename(filePath)}:`, errorMsg);
        }
      }

      result.success = result.stats.successCount > 0;
      
      console.log(`扫描完成: 成功 ${result.stats.successCount}/${result.stats.totalFiles} 个文件`);
      console.log(`总共加载 ${result.stats.totalChunks} 个知识块`);

      return result;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '扫描过程发生未知错误';
      result.errors.push({
        file: 'scanner',
        error: errorMsg
      });
      console.error('扫描本地知识库失败:', errorMsg);
      return result;
    }
  }

  /**
   * 递归查找所有PDF文件
   */
  private findPDFFiles(dirPath: string): string[] {
    const pdfFiles: string[] = [];

    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          // 递归扫描子目录
          pdfFiles.push(...this.findPDFFiles(itemPath));
        } else if (stat.isFile() && item.toLowerCase().endsWith('.pdf')) {
          // 跳过隐藏文件和系统文件
          if (!item.startsWith('.') && !item.startsWith('~')) {
            pdfFiles.push(itemPath);
          }
        }
      }
    } catch (error) {
      console.error(`扫描目录失败 ${dirPath}:`, error);
    }

    return pdfFiles;
  }

  /**
   * 获取知识库目录信息
   */
  getKnowledgeDataInfo() {
    try {
      if (!fs.existsSync(this.knowledgeDataPath)) {
        return {
          exists: false,
          path: this.knowledgeDataPath,
          totalFiles: 0,
          directories: []
        };
      }

      const pdfFiles = this.findPDFFiles(this.knowledgeDataPath);
      const directories = this.getDirectoryStructure(this.knowledgeDataPath);

      return {
        exists: true,
        path: this.knowledgeDataPath,
        totalFiles: pdfFiles.length,
        directories,
        files: pdfFiles.map(filePath => ({
          name: path.basename(filePath),
          path: filePath,
          size: fs.statSync(filePath).size,
          relativePath: path.relative(this.knowledgeDataPath, filePath)
        }))
      };
    } catch (error) {
      console.error('获取知识库信息失败:', error);
      return {
        exists: false,
        path: this.knowledgeDataPath,
        totalFiles: 0,
        directories: [],
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 获取目录结构
   */
  private getDirectoryStructure(dirPath: string): any[] {
    const structure: any[] = [];

    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        if (item.startsWith('.')) continue; // 跳过隐藏文件

        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          const pdfCount = this.findPDFFiles(itemPath).length;
          structure.push({
            name: item,
            type: 'directory',
            path: itemPath,
            pdfCount,
            children: pdfCount > 0 ? this.getDirectoryStructure(itemPath) : []
          });
        }
      }
    } catch (error) {
      console.error(`获取目录结构失败 ${dirPath}:`, error);
    }

    return structure;
  }

  /**
   * 清空当前知识库并重新扫描
   */
  async rescanKnowledge(): Promise<ScanResult> {
    console.log('清空现有知识库...');
    pdfParser.clearKnowledge();
    
    console.log('重新扫描本地知识库...');
    return await this.scanLocalKnowledge();
  }

  /**
   * 检查知识库是否已初始化
   */
  isKnowledgeLoaded(): boolean {
    const stats = pdfParser.getStats();
    return stats.documents > 0;
  }
}

// 全局扫描器实例
export const localScanner = new LocalKnowledgeScanner(); 