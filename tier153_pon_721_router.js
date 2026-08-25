const express = require('express');
const r = express.Router();
const { funcs } = require('./tier153_pon_721_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/leukemia', h(F.leukemia));
r.post('/brain_tumor', h(F.brain_tumor));
r.post('/solid_peds', h(F.solid_peds));
r.post('/chemo_peds', h(F.chemo_peds));
r.post('/late_effects', h(F.late_effects));
module.exports = r;