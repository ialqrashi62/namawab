const express = require('express');
const r = express.Router();
const { funcs } = require('./tier148_bld_704_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/donor_screen', h(F.donor_screen));
r.post('/unit', h(F.unit));
r.post('/crossmatch', h(F.crossmatch));
r.post('/transfusion_event', h(F.transfusion_event));
r.post('/inventory', h(F.inventory));
module.exports = r;