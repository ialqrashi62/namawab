const express = require('express');
const r = express.Router();
const { funcs } = require('./tier150_rhe_711_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/ra', h(F.ra));
r.post('/sle', h(F.sle));
r.post('/vasculitis', h(F.vasculitis));
r.post('/spondylo', h(F.spondylo));
r.post('/gout', h(F.gout));
module.exports = r;