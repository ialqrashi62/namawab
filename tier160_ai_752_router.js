const express = require('express');
const r = express.Router();
const { funcs } = require('./tier160_ai_752_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/cds', h(F.cds));
r.post('/risk_score', h(F.risk_score));
r.post('/chatbot', h(F.chatbot));
r.post('/imaging_ai', h(F.imaging_ai));
r.post('/genomic_ai', h(F.genomic_ai));
module.exports = r;