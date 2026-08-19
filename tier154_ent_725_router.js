const express = require('express');
const r = express.Router();
const { funcs } = require('./tier154_ent_725_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/ent_exam', h(F.ent_exam));
r.post('/audiology', h(F.audiology));
r.post('/surgery_ent', h(F.surgery_ent));
r.post('/voice', h(F.voice));
r.post('/sinus', h(F.sinus));
module.exports = r;