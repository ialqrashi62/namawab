const express = require('express');
const r = express.Router();
const { funcs } = require('./tier146_irr_696_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/biopsy', h(F.biopsy));
r.post('/drain', h(F.drain));
r.post('/angio', h(F.angio));
r.post('/tace', h(F.tace));
r.post('/radiofrequency', h(F.radiofrequency));
module.exports = r;