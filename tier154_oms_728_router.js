const express = require('express');
const r = express.Router();
const { funcs } = require('./tier154_oms_728_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/consult', h(F.consult));
r.post('/extraction', h(F.extraction));
r.post('/orthognathic', h(F.orthognathic));
r.post('/trauma', h(F.trauma));
r.post('/oral_pathology', h(F.oral_pathology));
module.exports = r;