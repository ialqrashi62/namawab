const express = require('express');
const router = express.Router();
const { funcs } = require('./tier103_radiology_extended_539_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ct_protocol', asyncH((req, res) => { const r = f.ct_protocol(req.body || {}); res.json({ ok: true, op: 'ct_protocol', result: r }); }));
router.post('/mri_protocol', asyncH((req, res) => { const r = f.mri_protocol(req.body || {}); res.json({ ok: true, op: 'mri_protocol', result: r }); }));
router.post('/interventional_radiology', asyncH((req, res) => { const r = f.interventional_radiology(req.body || {}); res.json({ ok: true, op: 'interventional_radiology', result: r }); }));
router.post('/contrast_reaction', asyncH((req, res) => { const r = f.contrast_reaction(req.body || {}); res.json({ ok: true, op: 'contrast_reaction', result: r }); }));
router.post('/image_guided_biopsy', asyncH((req, res) => { const r = f.image_guided_biopsy(req.body || {}); res.json({ ok: true, op: 'image_guided_biopsy', result: r }); }));
module.exports = router;
