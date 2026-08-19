const express = require('express');
const r = express.Router();
const { funcs } = require('./tier150_hem_712_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/anticoag', h(F.anticoag));
r.post('/anticoag_bleed', h(F.anticoag_bleed));
r.post('/thrombosis', h(F.thrombosis));
r.post('/apheresis', h(F.apheresis));
r.post('/hematology_dx', h(F.hematology_dx));
module.exports = r;