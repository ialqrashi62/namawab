const express = require('express');
const r = express.Router();
const { funcs } = require('./tier160_lab_754_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/lab_order', h(F.lab_order));
r.post('/lab_result', h(F.lab_result));
r.post('/micro', h(F.micro));
r.post('/blood_bank', h(F.blood_bank));
r.post('/molecular_lab', h(F.molecular_lab));
module.exports = r;