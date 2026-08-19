const express = require('express');
const r = express.Router();
const { funcs } = require('./tier156_hpb_736_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/liver_resection', h(F.liver_resection));
r.post('/pancreas', h(F.pancreas));
r.post('/biliary', h(F.biliary));
r.post('/spleen', h(F.spleen));
r.post('/hernia', h(F.hernia));
module.exports = r;