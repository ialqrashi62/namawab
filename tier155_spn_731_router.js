const express = require('express');
const r = express.Router();
const { funcs } = require('./tier155_spn_731_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/disc', h(F.disc));
r.post('/fusion', h(F.fusion));
r.post('/deformity', h(F.deformity));
r.post('/tumor_spine', h(F.tumor_spine));
r.post('/outcome_spine', h(F.outcome_spine));
module.exports = r;