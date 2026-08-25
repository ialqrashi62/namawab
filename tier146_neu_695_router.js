const express = require('express');
const r = express.Router();
const { funcs } = require('./tier146_neu_695_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/craniotomy', h(F.craniotomy));
r.post('/spine_op', h(F.spine_op));
r.post('/vp_shunt', h(F.vp_shunt));
r.post('/intracranial_monitor', h(F.intracranial_monitor));
r.post('/skull_base', h(F.skull_base));
module.exports = r;