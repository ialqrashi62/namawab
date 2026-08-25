const express = require('express');
const r = express.Router();
const { funcs } = require('./tier145_pt_691_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/assessment', h(F.assessment));
r.post('/exercise', h(F.exercise));
r.post('/manual', h(F.manual));
r.post('/modality', h(F.modality));
r.post('/discharge', h(F.discharge));
module.exports = r;