const express = require('express');
const r = express.Router();
const { funcs } = require('./tier147_pat_698_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/gross', h(F.gross));
r.post('/micro', h(F.micro));
r.post('/frozen', h(F.frozen));
r.post('/cyto', h(F.cyto));
r.post('/molecular', h(F.molecular));
module.exports = r;