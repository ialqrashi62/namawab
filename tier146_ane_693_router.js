const express = require('express');
const r = express.Router();
const { funcs } = require('./tier146_ane_693_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/preop', h(F.preop));
r.post('/induction', h(F.induction));
r.post('/intraop', h(F.intraop));
r.post('/pain', h(F.pain));
r.post('/emergence', h(F.emergence));
module.exports = r;