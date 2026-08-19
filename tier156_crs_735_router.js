const express = require('express');
const r = express.Router();
const { funcs } = require('./tier156_crs_735_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/colonoscopy', h(F.colonoscopy));
r.post('/colorectal_ca', h(F.colorectal_ca));
r.post('/resect', h(F.resect));
r.post('/pouch', h(F.pouch));
r.post('/followup_crc', h(F.followup_crc));
module.exports = r;