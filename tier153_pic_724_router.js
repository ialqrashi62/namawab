const express = require('express');
const r = express.Router();
const { funcs } = require('./tier153_pic_724_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/picu_admit', h(F.picu_admit));
r.post('/picu_vent', h(F.picu_vent));
r.post('/picu_drugs', h(F.picu_drugs));
r.post('/sepsis_peds', h(F.sepsis_peds));
r.post('/picu_outcome', h(F.picu_outcome));
module.exports = r;