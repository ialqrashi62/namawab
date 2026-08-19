const express = require('express');
const r = express.Router();
const { funcs } = require('./tier149_car_705_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/echo', h(F.echo));
r.post('/stress_test', h(F.stress_test));
r.post('/cath', h(F.cath));
r.post('/device', h(F.device));
r.post('/heart_failure', h(F.heart_failure));
module.exports = r;