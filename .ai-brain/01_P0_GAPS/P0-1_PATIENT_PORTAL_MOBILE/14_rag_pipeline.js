/**
 * Patient Portal — RAG Pipeline
 */

'use strict';

const db = require('./db_postgres');

class PatientPortalRAG {
  constructor() {
    this.cache = new Map();
    this.cache_ttl_ms = 5 * 60 * 1000;
  }

  cosineSimilarity(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
    let dot = 0, mag1 = 0, mag2 = 0;
    for (let i = 0; i < a.length; i++) {
      dot += (a[i] || 0) * (b[i] || 0);
      mag1 += (a[i] || 0) ** 2;
      mag2 += (b[i] || 0) ** 2;
    }
    if (mag1 === 0 || mag2 === 0) return 0;
    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  async retrieve(query, queryEmbedding, options = {}) {
    const { topic = null, language = 'en', audience = 'patient', topK = 10 } = options;
    const cache_key = `${topic || 'all'}_${language}_${audience}_${topK}`;
    if (this.cache.has(cache_key)) {
      const cached = this.cache.get(cache_key);
      if (Date.now() - cached.ts < this.cache_ttl_ms) return cached.data;
    }
    const p = [1, language, audience];
    let sql = `SELECT id, content_chunk, embedding, metadata, source, topic, citation_class
               FROM patient_portal_knowledge WHERE tenant_id = $1 AND language = $2 AND audience = $3`;
    if (topic) { sql += ` AND topic = $4`; p.push(topic); }
    sql += ` LIMIT 100`;
    const r = await db.query(sql, p);
    const scored = r.rows.map(row => ({
      ...row,
      similarity: this.cosineSimilarity(queryEmbedding, row.embedding),
    }));
    scored.sort((a, b) => b.similarity - a.similarity);
    const top = scored.slice(0, topK);
    this.cache.set(cache_key, { ts: Date.now(), data: top });
    return top;
  }

  rerank(chunks, query) {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    return chunks.map(c => {
      const text = c.content_chunk.toLowerCase();
      const matches = queryTerms.filter(t => text.includes(t)).length;
      return { ...c, rerank_score: c.similarity * 0.7 + (matches / queryTerms.length) * 0.3 };
    }).sort((a, b) => b.rerank_score - a.rerank_score);
  }

  buildContext(rerankedChunks) {
    return rerankedChunks.slice(0, 5).map((c, i) =>
      `[${i + 1}] (${c.citation_class || 'Reference'}) ${c.content_chunk}\n   Source: ${c.source}, Topic: ${c.topic}`
    ).join('\n\n');
  }

  async query(query, queryEmbedding, options = {}) {
    const retrieved = await this.retrieve(query, queryEmbedding, options);
    const reranked = this.rerank(retrieved, query);
    const context = this.buildContext(reranked);
    return {
      query,
      context,
      citations: reranked.slice(0, 5).map(c => ({
        id: c.id, source: c.source, citation_class: c.citation_class,
        topic: c.topic, similarity: c.similarity,
      })),
      reranked_chunks: reranked.slice(0, 5),
    };
  }

  /**
   * SAFETY CHECKS — Critical for patient-facing AI
   */
  safetyCheck(ragResponse, userQuery) {
    const blocked = [];
    if (!ragResponse.context || ragResponse.context.length < 50) {
      blocked.push('NO_RELEVANT_CONTEXT');
    }
    if (ragResponse.citations.length === 0) {
      blocked.push('NO_CITATIONS');
    }

    // Patient safety guardrails
    const lower_query = userQuery.toLowerCase();
    const lower_context = ragResponse.context.toLowerCase();

    if (lower_query.includes('diagnose') || lower_query.includes('what do i have')) {
      blocked.push('DEFINITIVE_DIAGNOSIS_NOT_ALLOWED');
    }

    if (lower_query.includes('stop medication') || lower_query.includes('change dose')) {
      if (!lower_context.includes('doctor') && !lower_context.includes('physician')) {
        blocked.push('MEDICATION_CHANGE_REQUIRES_DOCTOR');
      }
    }

    if (lower_query.includes('controlled') && (lower_query.includes('prescribe') || lower_query.includes('give me'))) {
      blocked.push('CONTROLLED_SUBSTANCE_REQUIRES_IN_PERSON');
    }

    return {
      blocked,
      safe: blocked.length === 0,
      message: blocked.length === 0 ? 'RAG safe' : `Blocked: ${blocked.join(', ')}`,
    };
  }
}

module.exports = PatientPortalRAG;
