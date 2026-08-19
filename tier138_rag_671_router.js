const express = require('express');
const router = express.Router();
const { funcs } = require('./tier138_rag_671_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/chunk_embed', asyncH((req, res) => { const r = f.chunk_embed(req.body || {}); res.json({ ok: true, op: 'chunk_embed', result: r }); }));
router.post('/vector_search', asyncH((req, res) => { const r = f.vector_search(req.body || {}); res.json({ ok: true, op: 'vector_search', result: r }); }));
router.post('/rerank', asyncH((req, res) => { const r = f.rerank(req.body || {}); res.json({ ok: true, op: 'rerank', result: r }); }));
router.post('/rag_query', asyncH((req, res) => { const r = f.rag_query(req.body || {}); res.json({ ok: true, op: 'rag_query', result: r }); }));
router.post('/hallucination_check', asyncH((req, res) => { const r = f.hallucination_check(req.body || {}); res.json({ ok: true, op: 'hallucination_check', result: r }); }));
module.exports = router;