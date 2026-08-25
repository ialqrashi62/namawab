const express = require('express');
const r = express.Router();
const { funcs } = require('./tier150_end_710_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/dm_assess', h(F.dm_assess));
r.post('/dm_comp', h(F.dm_comp));
r.post('/thyroid', h(F.thyroid));
r.post('/adrenal', h(F.adrenal));
r.post('/bone', h(F.bone));
module.exports = r;