const express = require('express');
const r = express.Router();
const { funcs } = require('./tier146_hem_694_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/cbc', h(F.cbc));
r.post('/coagulation', h(F.coagulation));
r.post('/transfusion', h(F.transfusion));
r.post('/chemo', h(F.chemo));
r.post('/marrow', h(F.marrow));
module.exports = r;