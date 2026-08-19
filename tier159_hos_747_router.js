const express = require('express');
const r = express.Router();
const { funcs } = require('./tier159_hos_747_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/bed', h(F.bed));
r.post('/staffing', h(F.staffing));
r.post('/incident', h(F.incident));
r.post('/quality_metric', h(F.quality_metric));
r.post('/risk_mgmt', h(F.risk_mgmt));
module.exports = r;