const express = require('express');
const r = express.Router();
const { funcs } = require('./tier148_obg_702_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/prenatal', h(F.prenatal));
r.post('/labor', h(F.labor));
r.post('/delivery', h(F.delivery));
r.post('/pp_care', h(F.pp_care));
r.post('/gyn_proc', h(F.gyn_proc));
module.exports = r;