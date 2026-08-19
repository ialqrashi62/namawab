const express = require('express');
const r = express.Router();
const { funcs } = require('./tier158_mif_746_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/recurrent_loss', h(F.recurrent_loss));
r.post('/preconception', h(F.preconception));
r.post('/early_preg', h(F.early_preg));
r.post('/ectopic', h(F.ectopic));
r.post('/pregnancy_loss', h(F.pregnancy_loss));
module.exports = r;