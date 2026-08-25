const express = require('express');
const r = express.Router();
const { funcs } = require('./tier151_pod_715_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/assess', h(F.assess));
r.post('/nail_care', h(F.nail_care));
r.post('/orthotic', h(F.orthotic));
r.post('/diabetic_foot', h(F.diabetic_foot));
r.post('/biomech', h(F.biomech));
module.exports = r;