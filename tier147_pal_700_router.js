const express = require('express');
const r = express.Router();
const { funcs } = require('./tier147_pal_700_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/consult', h(F.consult));
r.post('/pain', h(F.pain));
r.post('/symptom', h(F.symptom));
r.post('/goals_care', h(F.goals_care));
r.post('/hospice', h(F.hospice));
module.exports = r;