// filepath: namaweb/ai/co_pilot.js
// AI Co-Pilot — End-to-end clinical Q&A with RAG
// Pattern: nm-rag-vector
// 'use strict';

const { embedBatch } = require('./embedder');
const { hybridSearch, search } = require('./vector_store');
const { rerank, compress, buildPrompt, parseCitations } = require('./pipeline_utils');
const { getPrompt, PROMPTS } = require('./prompts');
const { generate, generateWithFallback } = require('./generate');
const db = require('../db_postgres');
const crypto = require('crypto');

// Logger is optional (may not exist in some deployments)
let logger;
try {
    logger = require('../middleware/logger');
} catch (_) {
    logger = { info: () => {}, warn: () => {}, error: () => {} };
}

const PHI_PATTERNS = [
    /\bMRN[-\s]?\d+\b/gi,
    /\b\d{10}\b/g,                              // Saudi phone (10 digits)
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,          // dates
    /\b\d{12}\b/g                                // Saudi national ID
];

function anonymize(text) {
    let out = text;
    for (const pat of PHI_PATTERNS) out = out.replace(pat, '[REDACTED]');
    return out;
}

function hash(s) {
    return crypto.createHash('sha256').update(s).digest('hex');
}

/**
 * Main co-pilot entry point
 * @param {Object} params
 * @param {number} params.tenantId
 * @param {number} params.userId
 * @param {string} params.role  - doctor, nurse, etc.
 * @param {string} params.query - user question
 * @param {string} params.locale - ar|en|fr|ur
 * @param {string} params.docKind - optional filter
 * @returns {Promise<Object>} - answer + citations + confidence + disclaimer
 */
async function ask({ tenantId, userId, role, query, locale = 'ar', docKind = null }) {
    const start = Date.now();
    const sessionId = `co-${Date.now()}-${userId}`;

    logger.info({ tenantId, userId, role, queryLen: query.length }, 'co-pilot ask started');

    try {
        // 1. Anonymize PHI before embedding
        const anonQuery = anonymize(query);

        // 2. Embed query
        const [emb] = await embedBatch([anonQuery]);

        // 3. Hybrid retrieval (vector + BM25)
        const candidates = await hybridSearch(tenantId, anonQuery, emb, { k: 24, docKind });

        if (candidates.length === 0) {
            logger.warn({ tenantId, userId }, 'no candidates found');
            return {
                answer: 'لم يتم العثور على مستندات ذات صلة في قاعدة المعرفة. حاول إعادة صياغة السؤال أو التواصل مع أخصائي.',
                citations: [],
                confidence: 'low',
                disclaimer: getDisclaimer(locale),
                latency_ms: Date.now() - start,
                session_id: sessionId
            };
        }

        // 4. Rerank
        const reranked = await rerank(query, candidates, 6);

        // 5. Compress to budget
        const compressed = await compress(query, reranked, 1500);

        // 6. Build prompt
        const systemPrompt = getPrompt('clinical_qa', locale, { role, tenant: process.env.TENANT_NAME || 'NamaMedical' });
        const userPrompt = buildPrompt(query, compressed);

        // 7. Generate with fallback chain
        const result = await generateWithFallback({
            system: systemPrompt,
            user: userPrompt,
            sessionId,
            tenantId,
            userId,
            model: 'gpt-4o-mini'
        });

        // 8. Parse citations
        const citations = parseCitations(result.text, compressed);

        // 9. Confidence scoring
        const confidence = scoreConfidence(result.text, reranked, citations);

        // 10. Disclaimer
        const disclaimer = getDisclaimer(locale);

        // 11. Log to ai_prompt_log
        const latency = Date.now() - start;
        await logPromptCall({
            tenantId, userId, sessionId, role,
            inputHash: hash(anonQuery), outputHash: hash(result.text),
            promptTokens: result.usage.prompt_tokens,
            completionTokens: result.usage.completion_tokens,
            model: result.model,
            provider: result.provider,
            latency,
            citations
        });

        logger.info({
            tenantId, userId, latency,
            confidence,
            tokensIn: result.usage.prompt_tokens,
            tokensOut: result.usage.completion_tokens
        }, 'co-pilot ask completed');

        return {
            answer: result.text,
            citations,
            confidence,
            provider: result.provider,
            model: result.model,
            disclaimer,
            latency_ms: latency,
            session_id: sessionId
        };

    } catch (err) {
        logger.error({ tenantId, userId, err: err.message, stack: err.stack }, 'co-pilot ask failed');
        return {
            answer: 'حدث خطأ في معالجة السؤال. حاول مرة أخرى.',
            citations: [],
            confidence: 'unknown',
            disclaimer: getDisclaimer(locale),
            error: err.message,
            latency_ms: Date.now() - start,
            session_id: sessionId
        };
    }
}

function getDisclaimer(locale) {
    const disclaimers = {
        ar: 'هذا مساعد دعم سريري. التشخيص والعلاج النهائي مسؤولية الطبيب المعالج. لا يُغني عن رأي الطبيب المختص.',
        en: 'This is clinical decision support. Final diagnosis and treatment remain the physician\'s responsibility.',
        fr: 'Ceci est une aide à la décision clinique. Le diagnostic et le traitement final restent la responsabilité du médecin.',
        ur: 'یہ طبی فیصلے کی معاونت ہے۔ حتمی تشخیص اور علاج کی ذمہ داری معالج ڈاکٹر کی ہے۔'
    };
    return disclaimers[locale] || disclaimers.ar;
}

function scoreConfidence(answer, reranked, citations) {
    const explicitCitations = (answer.match(/\[doc-\d+:chunk-\d+\]/g) || []).length;
    const hasCitations = citations.length > 0;
    const topSimilarity = reranked[0]?.similarity || 0;

    if (explicitCitations >= 3 && topSimilarity > 0.7) return 'high';
    if (explicitCitations >= 1 && topSimilarity > 0.6) return 'moderate';
    if (hasCitations) return 'low';
    return 'very_low';
}

async function logPromptCall({ tenantId, userId, sessionId, role, inputHash, outputHash,
                                promptTokens, completionTokens, model, provider, latency, citations }) {
    try {
        await db.query(`
            INSERT INTO ai_prompt_log (tenant_id, user_id, session_id, prompt_key, version, locale,
                role, input_hash, output_hash, latency_ms, prompt_tokens, completion_tokens,
                model, provider, citations)
            VALUES ($1,$2,$3,'clinical_qa','1.2.0','ar',$4,$5,$6,$7,$8,$9,$10,$11,$12)
        `, [tenantId, userId, sessionId, role, inputHash, outputHash, latency,
            promptTokens, completionTokens, model, provider, JSON.stringify(citations)]);
    } catch (err) {
        logger.error({ err: err.message }, 'failed to log prompt call');
    }
}

/**
 * Stream variant — for real-time responses
 */
async function* askStream(params) {
    const { query, locale = 'ar' } = params;
    const anonQuery = anonymize(query);

    // 1. embed + retrieve
    const [emb] = await embedBatch([anonQuery]);
    const candidates = await hybridSearch(params.tenantId, anonQuery, emb, { k: 24 });
    const reranked = await rerank(query, candidates, 6);
    const compressed = await compress(query, reranked, 1500);

    const systemPrompt = getPrompt('clinical_qa', locale, { role: params.role });
    const userPrompt = buildPrompt(query, compressed);

    // 2. stream from provider
    const { streamGenerate } = require('./generate');
    for await (const chunk of streamGenerate({ system: systemPrompt, user: userPrompt, model: 'gpt-4o-mini' })) {
        yield chunk;
    }
}

module.exports = { ask, askStream, anonymize, getDisclaimer };