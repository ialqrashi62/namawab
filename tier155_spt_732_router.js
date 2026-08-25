const express = require('express');
const r = express.Router();
const { funcs } = require('./tier155_spt_732_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/injury', h(F.injury));
r.post('/concussion', h(F.concussion));
r.post('/surgical', h(F.surgical));
r.post('/rehab', h(F.rehab));
r.post('/prp', h(F.prp));
module.exports = r;