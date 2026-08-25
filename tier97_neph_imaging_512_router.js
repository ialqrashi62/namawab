const express = require('express');
const router = express.Router();
const { funcs } = require('./tier97_neph_imaging_512_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/renal_ultrasound', asyncH((req, res) => { const r = f.renal_ultrasound(req.body || {}); res.json({ ok: true, op: 'renal_ultrasound', result: r }); }));
router.post('/renal_ct', asyncH((req, res) => { const r = f.renal_ct(req.body || {}); res.json({ ok: true, op: 'renal_ct', result: r }); }));
router.post('/renal_biopsy', asyncH((req, res) => { const r = f.renal_biopsy(req.body || {}); res.json({ ok: true, op: 'renal_biopsy', result: r }); }));
router.post('/renal_nuclear', asyncH((req, res) => { const r = f.renal_nuclear(req.body || {}); res.json({ ok: true, op: 'renal_nuclear', result: r }); }));
router.post('/renal_angiography', asyncH((req, res) => { const r = f.renal_angiography(req.body || {}); res.json({ ok: true, op: 'renal_angiography', result: r }); }));
module.exports = router;
