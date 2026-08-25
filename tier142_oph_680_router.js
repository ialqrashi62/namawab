const express = require('express');
const router = express.Router();
const { funcs } = require('./tier142_oph_680_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/refraction', asyncH((req, res) => { const r = f.refraction(req.body || {}); res.json({ ok: true, op: 'refraction', result: r }); }));
router.post('/cataract', asyncH((req, res) => { const r = f.cataract(req.body || {}); res.json({ ok: true, op: 'cataract', result: r }); }));
router.post('/retina', asyncH((req, res) => { const r = f.retina(req.body || {}); res.json({ ok: true, op: 'retina', result: r }); }));
router.post('/glaucoma', asyncH((req, res) => { const r = f.glaucoma(req.body || {}); res.json({ ok: true, op: 'glaucoma', result: r }); }));
router.post('/lasik', asyncH((req, res) => { const r = f.lasik(req.body || {}); res.json({ ok: true, op: 'lasik', result: r }); }));
module.exports = router;