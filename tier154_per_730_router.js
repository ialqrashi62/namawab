const express = require('express');
const r = express.Router();
const { funcs } = require('./tier154_per_730_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/perio_exam', h(F.perio_exam));
r.post('/scaling', h(F.scaling));
r.post('/surgery_perio', h(F.surgery_perio));
r.post('/implant', h(F.implant));
r.post('/maintenance', h(F.maintenance));
module.exports = r;