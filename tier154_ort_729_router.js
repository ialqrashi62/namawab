const express = require('express');
const r = express.Router();
const { funcs } = require('./tier154_ort_729_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/consult', h(F.consult));
r.post('/braces', h(F.braces));
r.post('/aligner', h(F.aligner));
r.post('/retention', h(F.retention));
r.post('/ortho_progress', h(F.ortho_progress));
module.exports = r;