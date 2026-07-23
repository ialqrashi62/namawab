/**
 * CitationLogic: Ensures AI responses are grounded in evidence.
 * Implements the 'Source: Guideline, Page X' requirement.
 */
class CitationLogic {
    static formatCitation(retrievedDocs) {
        if (!retrievedDocs || retrievedDocs.length === 0) return "No specific guideline found. Based on general clinical consensus.";

        const citations = retrievedDocs.map((doc, index) => {
            return `[${index + 1}] Source: ${doc.source}, Page: ${doc.page}`;
        });

        return `Evidence-based grounding:\n${citations.join('\n')}`;
    }

    static injectIntoPrompt(systemPrompt, retrievedContext) {
        const contextString = retrievedContext.map(c => c.content).join('\n\n');
        const citations = this.formatCitation(retrievedContext);

        return `
${systemPrompt}

### CLINICAL CONTEXT (RAG RETRIEVAL):
${contextString}

### CITATION REQUIREMENTS:
You must reference the sources above using [1], [2] etc. in your response.
${citations}
        `;
    }
}

module.exports = CitationLogic;
