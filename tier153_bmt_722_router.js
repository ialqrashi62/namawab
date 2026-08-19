const express = require('express');
const r = express.Router();
const { funcs } = require('./tier153_bmt_722_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/donor_match', h(F.donor_match));
r.post('/harvest', h(F.harvest));
r.post('/conditioning', h(F.conditioning));
r.post('/engraftment', h(F.engraftment));
r.post('/gvhd', h(F.gvhd));
module.exports = r;