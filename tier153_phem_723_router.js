const express = require('express');
const r = express.Router();
const { funcs } = require('./tier153_phem_723_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/sickle', h(F.sickle));
r.post('/hemophilia', h(F.hemophilia));
r.post('/thalassemia', h(F.thalassemia));
r.post('/itp', h(F.itp));
r.post('/transfusion_peds', h(F.transfusion_peds));
module.exports = r;