// filepath: namaweb/ai_co_pilot_router.js
// AI Co-Pilot Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const { ask } = require('./ai/co_pilot');
const vectorStore = require('./ai/vector_store');
const { embedBatch } = require('./ai/embedder');
const { chunkDocument } = require('./ai/chunker');

const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');

// GET /api/ai/health
router.get('/health', (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        services: {
            co_pilot: true,
            vector_store: true,
            embedder: !!process.env.OPENAI_API_KEY
        }
    });
});

// POST /api/ai/co-pilot/ask
router.post('/co-pilot/ask',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    idempotencyGuard,
    async (req, res) => {
        try {
            const { query, locale = 'ar', doc_kind } = req.body;
            if (!query || query.length < 3 || query.length > 2000) {
                return res.status(400).json({ error: 'invalid_query' });
            }
            const r = await ask({
                tenantId: req.tenantId,
                userId: req.userId,
                role: req.userRole,
                query,
                locale,
                docKind: doc_kind || null
            });
            res.json(r);
        } catch (err) {
            console.error('POST /ai/co-pilot/ask', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ai/documents/ingest
// Body: { doc_id, doc_kind, content, metadata }
router.post('/documents/ingest',
    requireAuth,
    requireTenantScope,
    requireRole('admin', 'owner'),
    idempotencyGuard,
    async (req, res) => {
        try {
            const { doc_id, doc_kind, content, metadata } = req.body;
            if (!doc_id || !doc_kind || !content) {
                return res.status(400).json({ error: 'missing_fields' });
            }

            // 1. Chunk
            const chunks = chunkDocument({
                id: doc_id, kind: doc_kind, content, metadata: metadata || {}
            });

            // 2. Embed
            const embeddings = await embedBatch(chunks.map(c => c.text));

            // 3. Upsert
            await vectorStore.upsert(req.tenantId, {
                docId: doc_id,
                docKind: doc_kind,
                chunks,
                embeddings
            });

            res.status(201).json({ ok: true, doc_id, chunks: chunks.length });
        } catch (err) {
            console.error('POST /ai/documents/ingest', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// GET /api/ai/documents
router.get('/documents',
    requireAuth,
    requireTenantScope,
    requireRole('admin', 'owner', 'doctor'),
    async (req, res) => {
        try {
            const docs = await vectorStore.listDocs(req.tenantId);
            res.json({ documents: docs });
        } catch (err) {
            console.error('GET /ai/documents', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// DELETE /api/ai/documents/:doc_id
router.delete('/documents/:doc_id',
    requireAuth,
    requireTenantScope,
    requireRole('admin', 'owner'),
    async (req, res) => {
        try {
            await vectorStore.deleteDoc(req.tenantId, req.params.doc_id);
            res.json({ ok: true });
        } catch (err) {
            console.error('DELETE /ai/documents', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// GET /api/ai/stats
router.get('/stats',
    requireAuth,
    requireTenantScope,
    requireRole('admin', 'owner'),
    async (req, res) => {
        try {
            const total = await vectorStore.count(req.tenantId);
            res.json({ total_chunks: total });
        } catch (err) {
            console.error('GET /ai/stats', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;