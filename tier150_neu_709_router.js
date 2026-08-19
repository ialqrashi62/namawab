const express = require('express');
const r = express.Router();
const { funcs } = require('./tier150_neu_709_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/stroke', h(F.stroke));
r.post('/epilepsy', h(F.epilepsy));
r.post('/ms', h(F.ms));
r.post('/movement', h(F.movement));
r.post('/neuropathy', h(F.neuropathy));
module.exports = r;