const express = require('express');
const r = express.Router();
const { funcs } = require('./tier158_men_745_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/assess', h(F.assess));
r.post('/hot_flashes', h(F.hot_flashes));
r.post('/hormone_therapy', h(F.hormone_therapy));
r.post('/bone_health', h(F.bone_health));
r.post('/gsm', h(F.gsm));
module.exports = r;