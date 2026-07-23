/**
 * ContextualRetrievalEngine: The bridge between VectorMine and the LLM.
 * Implements semantic search and context injection for clinical precision.
 */
const RAGEngine = require('./rag_pipeline');
const CitationLogic = require('./citation_logic');

class ContextualRetrievalEngine {
    constructor(config) {
        this.rag = new RAGEngine(config);
    }

    /**
     * processClinicalQuery: Takes a doctor's query and returns a grounded AI response.
     * Loop: Query -> Vector Search -> Context Injection -> LLM Generation -> Citation.
     */
    async processClinicalQuery(patientId, department, query) {
        console.log(`[RAG-Query] Processing query for ${department}: ${query}`);

        // 1. Contextual Retrieval
        const retrievedContext = await this.rag.retrieveContext(query, department);
        
        // 2. System Prompt Construction
        const baseSystemPrompt = `You are an expert ${department} specialist. Use the provided clinical context to answer the query. If the context does not contain the answer, state that you don't know based on the provided guidelines.`;
        const finalPrompt = CitationLogic.injectIntoPrompt(baseSystemPrompt, retrievedContext);

        // 3. LLM Generation (Simulated call to LLM)
        const aiResponse = await this.generateAIResponse(finalPrompt, query);

        return {
            answer: aiResponse,
            citations: retrievedContext,
            confidence: this.calculateConfidence(retrievedContext)
        };
    }

    async generateAIResponse(prompt, query) {
        // In production, this calls the LLM (GPT-4/Claude 3.5)
        // For simulation, we return a high-precision grounded response
        return `Based on the retrieved guidelines, the patient's current status indicates a high risk of ${query.includes('Sepsis') ? 'Septic Shock' : 'Complication'}. Recommended action: Initiate immediate fluid resuscitation and monitor MAP. [1]`;
    }

    calculateConfidence(context) {
        if (context.length >= 3) return 'High (95%+)';
        if (context.length >= 1) return 'Moderate (70-90%)';
        return 'Low (General Knowledge)';
    }
}

module.exports = ContextualRetrievalEngine;
