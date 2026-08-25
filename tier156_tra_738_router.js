const express = require('express');
const r = express.Router();
const { funcs } = require('./tier156_tra_738_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/trauma_eval', h(F.trauma_eval));
r.post('/resus', h(F.resus));
r.post('/damage_control', h(F.damage_control));
r.post('/complication', h(F.complication));
r.post('/outcome_trauma', h(F.outcome_trauma));
module.exports = r;