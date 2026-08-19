const express = require('express');
const r = express.Router();
const { funcs } = require('./tier160_rs_753_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/trial', h(F.trial));
r.post('/cohort', h(F.cohort));
r.post('/registry', h(F.registry));
r.post('/iomt', h(F.iomt));
r.post('/ehr_config', h(F.ehr_config));
module.exports = r;