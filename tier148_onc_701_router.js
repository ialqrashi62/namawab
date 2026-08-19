const express = require('express');
const r = express.Router();
const { funcs } = require('./tier148_onc_701_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/staging', h(F.staging));
r.post('/tnm', h(F.tnm));
r.post('/targeted', h(F.targeted));
r.post('/rad_onc', h(F.rad_onc));
r.post('/follow_up', h(F.follow_up));
module.exports = r;