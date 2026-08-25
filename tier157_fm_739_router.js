const express = require('express');
const r = express.Router();
const { funcs } = require('./tier157_fm_739_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/visit', h(F.visit));
r.post('/screening', h(F.screening));
r.post('/chronic_care', h(F.chronic_care));
r.post('/health_promotion', h(F.health_promotion));
r.post('/family_history', h(F.family_history));
module.exports = r;