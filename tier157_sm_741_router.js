const express = require('express');
const r = express.Router();
const { funcs } = require('./tier157_sm_741_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/pre_participation', h(F.pre_participation));
r.post('/concussion', h(F.concussion));
r.post('/acl_rehab', h(F.acl_rehab));
r.post('/throwing', h(F.throwing));
r.post('/recovery', h(F.recovery));
module.exports = r;