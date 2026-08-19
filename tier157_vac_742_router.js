const express = require('express');
const r = express.Router();
const { funcs } = require('./tier157_vac_742_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/travel_consult', h(F.travel_consult));
r.post('/altitude', h(F.altitude));
r.post('/dive_med', h(F.dive_med));
r.post('/vaccination', h(F.vaccination));
r.post('/occupational', h(F.occupational));
module.exports = r;