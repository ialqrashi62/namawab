// filepath: namaweb/ai/embedder.js
// Embedding adapter — multi-model
// Pattern: nm-multimodel
'use strict';

const PRICING = {
    'text-embedding-3-small': { input: 0.020 },
    'text-embedding-3-large': { input: 0.130 }
};

async function embedBatch(texts, model = 'text-embedding-3-small') {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not set');
    }
    const { OpenAI } = require('openai');
    const client = new OpenAI();
    const r = await client.embeddings.create({
        model,
        input: texts,
        dimensions: 1536
    });
    return r.data.map(d => d.embedding);
}

function costEstimate(texts, model = 'text-embedding-3-small') {
    const totalChars = texts.join('').length;
    const tokens = Math.ceil(totalChars / 4);
    const price = PRICING[model]?.input || 0;
    return (tokens / 1e6) * price;
}

module.exports = { embedBatch, costEstimate, PRICING };