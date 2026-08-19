const express = require('express');
const r = express.Router();
const { funcs } = require('./tier151_wou_714_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/wound_assess', h(F.wound_assess));
r.post('/dressing', h(F.dressing));
r.post('/debridement', h(F.debridement));
r.post('/healing_progress', h(F.healing_progress));
r.post('/wound_bio', h(F.wound_bio));
module.exports = r;