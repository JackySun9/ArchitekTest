import 'dotenv/config';
import { glob } from 'glob';
import { promises as fs } from 'fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { RetrievalQAChain } from 'langchain/chains';
import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';

export class EnhancedRAGEngine {
  private embeddings: OllamaEmbeddings;
  private vectorStore: MemoryVectorStore | null = null;
  private llm: Ollama;
  private qaChain: RetrievalQAChain | null = null;

  constructor() {
    this.embeddings = new OllamaEmbeddings({
      model: 'nomic-embed-text:latest',
      baseUrl: 'http://localhost:11434',
    });

    this.llm = new Ollama({
      model: 'gemma3:27b',
      baseUrl: 'http://localhost:11434',
    });
  }

  async embedCodebase(sharedDir = 'shared'): Promise<void> {
    console.log('Starting enhanced codebase embedding...');
    
    const filePaths = await glob(`${sharedDir}/**/*.ts`);
    console.log(`Found ${filePaths.length} .ts files to embed.`);

    const textSplitter = new RecursiveCharacterTextSplitter({ 
      chunkSize: 1000, 
      chunkOverlap: 200,
      separators: ['\n\nclass ', '\n\nexport ', '\n\nfunction ', '\n\n', '\n', ' ', '']
    });

    // Collect ALL documents before creating vector store
    const allDocuments: Document[] = [];

    for (const filePath of filePaths) {
      console.log(`Processing ${filePath}...`);
      const content = await fs.readFile(filePath, 'utf-8');
      const chunks = await textSplitter.splitText(content);
      
      const documents = chunks.map((pageContent, i) => new Document({
        pageContent,
        metadata: {
          source: filePath,
          chunkIndex: i,
          fileType: 'typescript',
          // Extract class/function names for better retrieval
          codeType: this.detectCodeType(pageContent)
        }
      }));

      allDocuments.push(...documents);
    }

    // Create vector store with ALL documents at once
    this.vectorStore = new MemoryVectorStore(this.embeddings);
    await this.vectorStore.addDocuments(allDocuments);

    // Save to persistent storage
    await fs.writeFile('enhanced_vector_store.json', JSON.stringify({
      vectors: (this.vectorStore as any).memoryVectors,
      documents: allDocuments
    }, null, 2));

    console.log(`Successfully embedded ${allDocuments.length} chunks from ${filePaths.length} files`);
    
    // Initialize QA Chain
    this.initializeQAChain();
  }

  private detectCodeType(content: string): string {
    if (content.includes('class ')) return 'class';
    if (content.includes('function ') || content.includes('const ') && content.includes('=>')) return 'function';
    if (content.includes('interface ')) return 'interface';
    if (content.includes('type ')) return 'type';
    if (content.includes('export ')) return 'export';
    return 'code';
  }

  private initializeQAChain(): void {
    if (!this.vectorStore) throw new Error('Vector store not initialized');

    const retriever = this.vectorStore.asRetriever({
      k: 5, // Return top 5 most relevant chunks
      searchType: 'similarity'
    });

    // Simplified QA chain without the incompatible LLM type
    this.qaChain = RetrievalQAChain.fromLLM(this.llm as any, retriever, {
      returnSourceDocuments: true
    });
  }

  async queryCodebase(query: string): Promise<{answer: string, sources: Document[]}> {
    if (!this.qaChain) throw new Error('QA Chain not initialized');

    const result = await this.qaChain.call({ query });
    return {
      answer: result.text,
      sources: result.sourceDocuments
    };
  }

  async getRelevantContext(query: string, k = 5): Promise<Document[]> {
    if (!this.vectorStore) throw new Error('Vector store not initialized');
    
    return await this.vectorStore.similaritySearch(query, k);
  }

  async loadPersistedStore(): Promise<void> {
    try {
      const data = JSON.parse(await fs.readFile('enhanced_vector_store.json', 'utf-8'));
      this.vectorStore = new MemoryVectorStore(this.embeddings);
      (this.vectorStore as any).memoryVectors = data.vectors;
      this.initializeQAChain();
      console.log('Loaded persisted vector store');
    } catch (error) {
      console.log('No persisted store found, will need to embed codebase first');
    }
  }
}
