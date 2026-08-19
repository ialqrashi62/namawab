const express = require('express');
const r = express.Router();
const { funcs } = require('./tier145_cos_692_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/consultation', h(F.consultation));
r.post('/surgery', h(F.surgery));
r.post('/injectable', h(F.injectable));
r.post('/las_skin', h(F.las_skin));
r.post('/complications', h(F.complications));
module.exports = r;