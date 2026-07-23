const { PDFDocument } = require('pdf-lib');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { PGVectorStore } = require('@langchain/community/vectorstores/pgvector');
const { Pool } = require('pg');

/**
 * RAGEngine: The Cognitive Core of NamaMedical
 * Implements the full pipeline: Loading -> Chunking -> Embedding -> Storage
 */
class RAGEngine {
    constructor(config) {
        this.pool = new Pool(config.dbConfig);
        this.embeddings = new OpenAIEmbeddings({ openAIApiKey: config.apiKey });
        this.splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
    }

    /**
     * Ingestion Pipeline: Processes a medical guideline PDF and stores it in VectorMine.
     */
    async ingestGuideline(filePath, department, guidelineVersion) {
        console.log(`[RAG-Ingest] Processing ${filePath} for ${department}...`);
        
        // 1. Document Loading
        const pdfDoc = await PDFDocument.load(filePath);
        const text = await this.extractTextFromPDF(pdfDoc);

        // 2. Text Chunking
        const chunks = await this.splitter.splitText(text);

        // 3. Embedding Generation & Vector Storage
        await this.storeChunks(chunks, department, guidelineVersion);
        
        return { status: 'success', chunksProcessed: chunks.length };
    }

    async storeChunks(chunks, department, version) {
        const vectorStore = await PGVectorStore.initialize(this.embeddings, {
            postgresConnectionString: process.env.DATABASE_URL,
            tableName: 'vector_store',
        });

        const documents = chunks.map(chunk => ({
            pageContent: chunk,
            metadata: { 
                department, 
                version, 
                ingestedAt: new Date().toISOString(),
                evidenceLevel: 'High' 
            }
        }));

        await vectorStore.addDocuments(documents);
    }

    /**
     * Contextual Retrieval: Fetches the most relevant clinical evidence for a specific case.
     */
    async retrieveContext(query, department) {
        const vectorStore = await PGVectorStore.initialize(this.embeddings, {
            postgresConnectionString: process.env.DATABASE_URL,
            tableName: 'vector_store',
        });

        const results = await vectorStore.similaritySearch(query, 3, {
            department: department
        });

        return results.map(res => ({
            content: res.pageContent,
            source: res.metadata.version,
            page: res.metadata.page || 'N/A'
        }));
    }

    async extractTextFromPDF(pdfDoc) {
        // Simplified PDF text extraction logic
        return pdfDoc.getPage(0).getTextContents(); 
    }
}

module.exports = RAGEngine;
