const express = require('express');
const r = express.Router();
const { funcs } = require('./tier159_fin_750_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/billing', h(F.billing));
r.post('/insurance_claim', h(F.insurance_claim));
r.post('/denial', h(F.denial));
r.post('/ar_followup', h(F.ar_followup));
r.post('/revenue', h(F.revenue));
module.exports = r;