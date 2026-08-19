const express = require('express');
const r = express.Router();
const { funcs } = require('./tier155_pmr_734_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/stroke_rehab', h(F.stroke_rehab));
r.post('/tbi_rehab', h(F.tbi_rehab));
r.post('/amputation', h(F.amputation));
r.post('/wheelchair', h(F.wheelchair));
r.post('/community_reentry', h(F.community_reentry));
module.exports = r;