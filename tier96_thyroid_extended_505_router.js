const express = require('express');
const router = express.Router();
const { funcs } = require('./tier96_thyroid_extended_505_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/thyroid_nodule', asyncH((req, res) => { const r = f.thyroid_nodule(req.body || {}); res.json({ ok: true, op: 'thyroid_nodule', result: r }); }));
router.post('/thyroid_cancer', asyncH((req, res) => { const r = f.thyroid_cancer(req.body || {}); res.json({ ok: true, op: 'thyroid_cancer', result: r }); }));
router.post('/thyroid_surgery', asyncH((req, res) => { const r = f.thyroid_surgery(req.body || {}); res.json({ ok: true, op: 'thyroid_surgery', result: r }); }));
router.post('/rai_therapy', asyncH((req, res) => { const r = f.rai_therapy(req.body || {}); res.json({ ok: true, op: 'rai_therapy', result: r }); }));
router.post('/thyroid_eye', asyncH((req, res) => { const r = f.thyroid_eye(req.body || {}); res.json({ ok: true, op: 'thyroid_eye', result: r }); }));
module.exports = router;
