const express = require('express');
const r = express.Router();
const { funcs } = require('./tier152_chi_720_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/chd_followup', h(F.chd_followup));
r.post('/adult_chd', h(F.adult_chd));
r.post('/transition', h(F.transition));
r.post('/long_term_outcome', h(F.long_term_outcome));
r.post('/cardiopulmonary_exercise', h(F.cardiopulmonary_exercise));
module.exports = r;