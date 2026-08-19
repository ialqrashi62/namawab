const express = require('express');
const r = express.Router();
const { funcs } = require('./tier158_and_744_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/semen', h(F.semen));
r.post('/testosterone', h(F.testosterone));
r.post('/ed', h(F.ed));
r.post('/infertility_male', h(F.infertility_male));
r.post('/fertility_preservation', h(F.fertility_preservation));
module.exports = r;