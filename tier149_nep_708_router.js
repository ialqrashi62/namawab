const express = require('express');
const r = express.Router();
const { funcs } = require('./tier149_nep_708_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/ckd_progression', h(F.ckd_progression));
r.post('/dialysis_access', h(F.dialysis_access));
r.post('/transplant_eval', h(F.transplant_eval));
r.post('/renal_replacement', h(F.renal_replacement));
r.post('/acid_base', h(F.acid_base));
module.exports = r;