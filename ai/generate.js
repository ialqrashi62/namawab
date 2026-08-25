// filepath: namaweb/ai/generate.js
// Multi-model LLM generate adapter with fallback chain
// Pattern: nm-multimodel
'use strict';

const PRICING = {
    'gpt-4o-mini':           { input: 0.15, output: 0.60 },
    'gpt-4o':                { input: 5.00, output: 15.00 },
    'claude-3-5-sonnet':     { input: 3.00, output: 15.00 },
    'claude-3-haiku':        { input: 0.25, output: 1.25 },
    'gemini-1.5-pro':        { input: 1.25, output: 5.00 },
    'gemini-1.5-flash':      { input: 0.075, output: 0.30 },
    'llama3.1:8b':           { input: 0, output: 0 },
    'mistral:7b':            { input: 0, output: 0 }
};

const FALLBACK_CHAIN = [
    { provider: 'openai', model: 'gpt-4o-mini' },
    { provider: 'anthropic', model: 'claude-3-haiku-20240307' },
    { provider: 'google', model: 'gemini-1.5-flash' },
    { provider: 'ollama', model: 'llama3.1:8b' }
];

async function generate({ provider, model, system, user, temperature = 0.2, maxTokens = 1024 }) {
    switch (provider) {
        case 'openai':    return await openaiGenerate(model, system, user, temperature, maxTokens);
        case 'anthropic': return await anthropicGenerate(model, system, user, temperature, maxTokens);
        case 'google':    return await googleGenerate(model, system, user, temperature, maxTokens);
        case 'ollama':    return await ollamaGenerate(model, system, user, temperature, maxTokens);
        default: throw new Error(`unknown_provider_${provider}`);
    }
}

async function openaiGenerate(model, system, user, temperature, maxTokens) {
    const { OpenAI } = require('openai');
    const client = new OpenAI();
    const r = await client.chat.completions.create({
        model, temperature, max_tokens: maxTokens,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
    });
    return {
        text: r.choices[0].message.content,
        usage: { prompt_tokens: r.usage.prompt_tokens, completion_tokens: r.usage.completion_tokens },
        provider: 'openai', model
    };
}

async function anthropicGenerate(model, system, user, temperature, maxTokens) {
    const Anthropic = require('@anthropic-ai/sdk').default;
    const client = new Anthropic();
    const r = await client.messages.create({
        model, system, max_tokens: maxTokens, temperature,
        messages: [{ role: 'user', content: user }]
    });
    return {
        text: r.content[0].text,
        usage: { prompt_tokens: r.usage.input_tokens, completion_tokens: r.usage.output_tokens },
        provider: 'anthropic', model
    };
}

async function googleGenerate(model, system, user, temperature, maxTokens) {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) throw new Error('GOOGLE_API_KEY not set');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: system + '\n\n' + user }] }],
            generationConfig: { temperature, maxOutputTokens: maxTokens }
        })
    });
    const j = await r.json();
    return {
        text: j.candidates[0].content.parts[0].text,
        usage: { prompt_tokens: j.usageMetadata.promptTokenCount, completion_tokens: j.usageMetadata.candidatesTokenCount },
        provider: 'google', model
    };
}

async function ollamaGenerate(model, system, user, temperature, maxTokens) {
    const r = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model, stream: false,
            options: { temperature, num_predict: maxTokens },
            messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
        })
    });
    const j = await r.json();
    return {
        text: j.message.content,
        usage: { prompt_tokens: j.prompt_eval_count, completion_tokens: j.eval_count },
        provider: 'ollama', model
    };
}

/**
 * Generate with fallback chain — tries each provider in order
 */
async function generateWithFallback({ system, user, sessionId, tenantId, userId, model = 'gpt-4o-mini' }) {
    const logger = require('../middleware/logger');
    const errors = [];

    for (const target of FALLBACK_CHAIN) {
        try {
            const r = await generate({ provider: target.provider, model: target.model, system, user });
            return r;
        } catch (err) {
            logger.warn({ sessionId, provider: target.provider, err: err.message }, 'fallback triggered');
            errors.push({ provider: target.provider, error: err.message });
        }
    }
    throw new Error(`all_providers_failed: ${JSON.stringify(errors)}`);
}

/**
 * Streaming variant (for chat UI)
 */
async function* streamGenerate({ provider = 'openai', model = 'gpt-4o-mini', system, user }) {
    const { OpenAI } = require('openai');
    const client = new OpenAI();
    const stream = await client.chat.completions.create({
        model, stream: true, temperature: 0.2,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
    });
    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) yield delta;
    }
}

module.exports = {
    generate,
    generateWithFallback,
    streamGenerate,
    PRICING,
    FALLBACK_CHAIN
};