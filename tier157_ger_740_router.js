const express = require('express');
const r = express.Router();
const { funcs } = require('./tier157_ger_740_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/cga', h(F.cga));
r.post('/cognitive', h(F.cognitive));
r.post('/falls_assess', h(F.falls_assess));
r.post('/deprescribing', h(F.deprescribing));
r.post('/advance_care', h(F.advance_care));
module.exports = r;