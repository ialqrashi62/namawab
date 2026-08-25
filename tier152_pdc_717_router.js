const express = require('express');
const r = express.Router();
const { funcs } = require('./tier152_pdc_717_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/fetal_echocardiogram', h(F.fetal_echocardiogram));
r.post('/congenital_dx', h(F.congenital_dx));
r.post('/peds_cath', h(F.peds_cath));
r.post('/arrhythmia_peds', h(F.arrhythmia_peds));
r.post('/single_ventricle', h(F.single_ventricle));
module.exports = r;