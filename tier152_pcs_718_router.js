const express = require('express');
const r = express.Router();
const { funcs } = require('./tier152_pcs_718_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/norwood', h(F.norwood));
r.post('/glenn', h(F.glenn));
r.post('/fontan', h(F.fontan));
r.post('/arterial_switch', h(F.arterial_switch));
r.post('/tetralogy_repair', h(F.tetralogy_repair));
module.exports = r;