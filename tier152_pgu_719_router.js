const express = require('express');
const r = express.Router();
const { funcs } = require('./tier152_pgu_719_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/well_visit', h(F.well_visit));
r.post('/developmental', h(F.developmental));
r.post('/immunizations', h(F.immunizations));
r.post('/new_born', h(F.new_born));
r.post('/adolescent', h(F.adolescent));
module.exports = r;