const express = require('express');
const r = express.Router();
const { funcs } = require('./tier151_pls_713_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/consult', h(F.consult));
r.post('/recon', h(F.recon));
r.post('/hand_surg', h(F.hand_surg));
r.post('/laser', h(F.laser));
r.post('/cmo', h(F.cmo));
module.exports = r;