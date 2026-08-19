const express = require('express');
const r = express.Router();
const { funcs } = require('./tier148_nic_703_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/admit', h(F.admit));
r.post('/vent', h(F.vent));
r.post('/feeding', h(F.feeding));
r.post('/sepsis_screen', h(F.sepsis_screen));
r.post('/discharge', h(F.discharge));
module.exports = r;