// filepath: namaweb/ai/pipeline_utils.js
// Pipeline utilities: rerank, compress, buildPrompt, parseCitations
// Pattern: nm-rag-template
'use strict';

/**
 * Rerank candidates by simple heuristic BM25-style score
 * For production, use cross-encoder
 */
async function rerank(query, candidates, topK = 6) {
    const qWords = new Set(query.toLowerCase().split(/\W+/).filter(w => w.length > 2));

    const scored = candidates.map(c => {
        const text = (c.text || '').toLowerCase();
        const words = text.split(/\W+/);
        let matches = 0;
        for (const w of words) {
            if (qWords.has(w)) matches++;
        }
        const bm25 = matches / Math.sqrt(words.length + 1);
        // Hybrid: combine vector similarity + bm25
        const vectorSim = c.similarity || 0;
        const combined = 0.7 * vectorSim + 0.3 * bm25;
        return { ...c, rerank_score: combined, bm25, vectorSim };
    });

    scored.sort((a, b) => b.rerank_score - a.rerank_score);
    return scored.slice(0, topK);
}

/**
 * Compress chunks to fit token budget
 */
async function compress(query, chunks, maxTokens = 1500) {
    const out = [];
    let total = 0;
    for (const c of chunks) {
        const tokens = (c.text || '').length / 4;
        if (total + tokens > maxTokens) break;
        out.push(c);
        total += tokens;
    }
    return out;
}

/**
 * Build prompt with context + question
 */
function buildPrompt(query, chunks) {
    const context = chunks.map((c, i) =>
        `[doc-${i + 1}:chunk-${c.chunk_idx}]\n${c.text}`
    ).join('\n\n');

    return `Context:\n${context}\n\nQuestion: ${query}\n\nAnswer with citations [doc-N:chunk-M]:`;
}

/**
 * Parse citation markers [doc-N:chunk-M] from answer
 */
function parseCitations(answer, chunks) {
    const regex = /\[doc-(\d+):chunk-(\d+)\]/g;
    const citations = [];
    const seen = new Set();

    let match;
    while ((match = regex.exec(answer)) !== null) {
        const docIdx = parseInt(match[1]) - 1;
        const chunkIdx = parseInt(match[2]);
        const key = `${docIdx}-${chunkIdx}`;

        if (seen.has(key)) continue;
        seen.add(key);

        const chunk = chunks[docIdx];
        if (!chunk) continue;

        citations.push({
            doc_idx: docIdx + 1,
            chunk_idx: chunkIdx,
            doc_id: chunk.doc_id,
            doc_kind: chunk.doc_kind,
            text_preview: (chunk.text || '').slice(0, 200),
            similarity: chunk.rerank_score || chunk.similarity
        });
    }

    return citations;
}

/**
 * Token estimation (rough)
 */
function estimateTokens(text) {
    const arabic = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const other = text.length - arabic;
    return Math.ceil(arabic / 2 + other / 4);
}

module.exports = {
    rerank,
    compress,
    buildPrompt,
    parseCitations,
    estimateTokens
};