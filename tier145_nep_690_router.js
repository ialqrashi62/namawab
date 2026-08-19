const express = require('express');
const r = express.Router();
const { funcs } = require('./tier145_nep_690_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/ckd_stage', h(F.ckd_stage));
r.post('/dialysis', h(F.dialysis));
r.post('/transplant', h(F.transplant));
r.post('/biopsy', h(F.biopsy));
r.post('/electrolyte', h(F.electrolyte));
module.exports = r;