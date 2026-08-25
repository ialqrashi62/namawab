const express = require('express');
const r = express.Router();
const { funcs } = require('./tier149_gi_707_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/endoscopy', h(F.endoscopy));
r.post('/liver', h(F.liver));
r.post('/ibd', h(F.ibd));
r.post('/gerd', h(F.gerd));
r.post('/biliary', h(F.biliary));
module.exports = r;