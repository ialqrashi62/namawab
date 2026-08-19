const express = require('express');
const r = express.Router();
const { funcs } = require('./tier159_inv_749_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/inventory', h(F.inventory));
r.post('/purchase_order', h(F.purchase_order));
r.post('/par_level', h(F.par_level));
r.post('/recall', h(F.recall));
r.post('/equipment', h(F.equipment));
module.exports = r;