const express = require('express');
const r = express.Router();
const { funcs } = require('./tier147_pha_699_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/pharmacokinetics', h(F.pharmacokinetics));
r.post('/pharmacogenomics', h(F.pharmacogenomics));
r.post('/stewardship', h(F.stewardship));
r.post('/compounding', h(F.compounding));
r.post('/clinical_pharm', h(F.clinical_pharm));
module.exports = r;