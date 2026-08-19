const express = require('express');
const r = express.Router();
const { funcs } = require('./tier155_pmn_733_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/pain_assess', h(F.pain_assess));
r.post('/injection', h(F.injection));
r.post('/scs', h(F.scs));
r.post('/opioid', h(F.opioid));
r.post('/outcomes', h(F.outcomes));
module.exports = r;