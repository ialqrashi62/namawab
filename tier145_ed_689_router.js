const express = require('express');
const r = express.Router();
const { funcs } = require('./tier145_ed_689_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/triage', h(F.triage));
r.post('/trauma', h(F.trauma));
r.post('/toxicology', h(F.toxicology));
r.post('/proc', h(F.proc));
r.post('/disposition', h(F.disposition));
module.exports = r;