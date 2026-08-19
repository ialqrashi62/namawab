const express = require('express');
const r = express.Router();
const { funcs } = require('./tier149_pul_706_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/pft', h(F.pft));
r.post('/sleep', h(F.sleep));
r.post('/copd', h(F.copd));
r.post('/asthma', h(F.asthma));
r.post('/bronchoscopy', h(F.bronchoscopy));
module.exports = r;