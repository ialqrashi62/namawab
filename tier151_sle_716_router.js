const express = require('express');
const r = express.Router();
const { funcs } = require('./tier151_sle_716_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/polysom', h(F.polysom));
r.post('/pap_titration', h(F.pap_titration));
r.post('/mslt', h(F.mslt));
r.post('/insomnia_cbt', h(F.insomnia_cbt));
r.post('/parasomnia', h(F.parasomnia));
module.exports = r;