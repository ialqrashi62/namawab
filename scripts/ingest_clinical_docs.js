#!/usr/bin/env node
// Wave 3A: Ingest clinical docs into AI vector store (auto-detects schema)
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB = require('../namaweb/db_postgres');
const DOCS_DIR = 'namaweb/seeds/clinical_docs';
const CHUNK_SIZE = 800;
const TENANT_ID = 1;

function hashEmbed(text, dim = 256) {
    const vec = new Array(dim).fill(0);
    const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const tokens = clean.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return vec;
    for (const tok of tokens) {
        const h = crypto.createHash('sha256').update(tok).digest();
        for (let i = 0; i < dim; i++) {
            const idx = h[i % h.length] ^ (i & 0xff);
            vec[i] += (idx / 255) - 0.5;
        }
    }
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map(v => v / norm);
}

function chunkDoc(doc) {
    const text = doc.content || '';
    const chunks = [];
    let i = 0;
    let idx = 0;
    while (i < text.length) {
        const end = Math.min(i + CHUNK_SIZE, text.length);
        let cut = end;
        if (end < text.length) {
            const lastPara = text.lastIndexOf('\n\n', end);
            if (lastPara > i + CHUNK_SIZE / 2) cut = lastPara;
        }
        const content = text.slice(i, cut).trim();
        if (content.length > 0) chunks.push({ text: content, idx });
        i = cut;
        idx++;
    }
    return chunks;
}

async function detectSchema() {
    const r = await DB.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'ai_document_chunks' ORDER BY ordinal_position");
    const cols = r.rows.map(x => x.column_name);
    if (cols.includes('chunk_idx')) return 'live';
    if (cols.includes('chunk_index')) return 'local';
    return null;
}

async function upsertChunk(doc, ch, embedding, schema) {
    const embStr = '{' + embedding.join(',') + '}';
    const meta = JSON.stringify({ title: doc.title, title_ar: doc.title_ar, source: doc.doc_id });

    if (schema === 'live') {
        await DB.query(`
            INSERT INTO ai_document_chunks (tenant_id, doc_id, doc_kind, chunk_idx, text, embedding, embedding_norm, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (doc_id, chunk_idx)
            DO UPDATE SET text = EXCLUDED.text, embedding = EXCLUDED.embedding, updated_at = NOW()
        `, [TENANT_ID, doc.doc_id, doc.doc_kind, ch.idx, ch.text, embStr, 1.0, meta]);
    } else {
        await DB.query(`
            INSERT INTO ai_document_chunks (tenant_id, doc_id, doc_kind, title, title_ar, chunk_index, chunk_text, embedding, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (doc_id, chunk_index)
            DO UPDATE SET chunk_text = EXCLUDED.chunk_text, embedding = EXCLUDED.embedding, updated_at = NOW()
        `, [TENANT_ID, doc.doc_id, doc.doc_kind, doc.title, doc.title_ar, ch.idx, ch.text, embStr, meta]);
    }
}

async function main() {
    const schema = await detectSchema();
    if (!schema) {
        console.error('ai_document_chunks table not found');
        process.exit(1);
    }
    console.log(`Schema detected: ${schema}`);

    await DB.query(`SET app.tenant_id = '${TENANT_ID}'`);
    const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.json'));
    let totalChunks = 0;

    for (const f of files) {
        const doc = JSON.parse(fs.readFileSync(path.join(DOCS_DIR, f), 'utf8'));
        const chunks = chunkDoc(doc);
        for (const ch of chunks) {
            const embedding = hashEmbed(ch.text);
            await upsertChunk(doc, ch, embedding, schema);
            totalChunks++;
        }
        console.log(`  ${doc.doc_id}: ${chunks.length} chunks`);
    }

    const total = await DB.query('SELECT COUNT(*) FROM ai_document_chunks WHERE tenant_id = $1', [TENANT_ID]);
    console.log(`\n✓ Ingested ${totalChunks} chunks (total in DB: ${total.rows[0].count})`);

    // Test a search
    console.log('\nTest search: hypertension treatment');
    const testQuery = 'hypertension first-line treatment';
    const qEmb = hashEmbed(testQuery);
    const search = await DB.query(`
        SELECT doc_id, doc_kind, text, embedding <=> $1::real[] AS distance
        FROM ai_document_chunks
        WHERE tenant_id = $2
        ORDER BY embedding <=> $1::real[]
        LIMIT 3
    `, ['{' + qEmb.join(',') + '}', TENANT_ID]);
    for (const row of search.rows) {
        console.log(`  ${row.doc_id} (dist: ${row.distance.toFixed(3)}) - ${row.text.slice(0, 80)}...`);
    }

    process.exit(0);
}

main().catch(e => {
    console.error('error:', e.message || e);
    process.exit(1);
});
