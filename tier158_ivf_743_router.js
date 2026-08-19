const express = require('express');
const r = express.Router();
const { funcs } = require('./tier158_ivf_743_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/consult', h(F.consult));
r.post('/stim', h(F.stim));
r.post('/retrieval', h(F.retrieval));
r.post('/transfer', h(F.transfer));
r.post('/outcome', h(F.outcome));
module.exports = r;