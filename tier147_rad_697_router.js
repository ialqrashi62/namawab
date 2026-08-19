const express = require('express');
const r = express.Router();
const { funcs } = require('./tier147_rad_697_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/ct', h(F.ct));
r.post('/mri', h(F.mri));
r.post('/us', h(F.us));
r.post('/xray', h(F.xray));
r.post('/mammo', h(F.mammo));
module.exports = r;