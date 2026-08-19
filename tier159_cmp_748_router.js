const express = require('express');
const r = express.Router();
const { funcs } = require('./tier159_cmp_748_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/hipaa', h(F.hipaa));
r.post('/audit', h(F.audit));
r.post('/accreditation', h(F.accreditation));
r.post('/training', h(F.training));
r.post('/license', h(F.license));
module.exports = r;