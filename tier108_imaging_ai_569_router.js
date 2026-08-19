const express = require('express');
const router = express.Router();
const { funcs } = require('./tier108_imaging_ai_569_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ai_detection', asyncH((req, res) => { const r = f.ai_detection(req.body || {}); res.json({ ok: true, op: 'ai_detection', result: r }); }));
router.post('/image_segmentation', asyncH((req, res) => { const r = f.image_segmentation(req.body || {}); res.json({ ok: true, op: 'image_segmentation', result: r }); }));
router.post('/classification', asyncH((req, res) => { const r = f.classification(req.body || {}); res.json({ ok: true, op: 'classification', result: r }); }));
router.post('/computer_aided_diagnosis', asyncH((req, res) => { const r = f.computer_aided_diagnosis(req.body || {}); res.json({ ok: true, op: 'computer_aided_diagnosis', result: r }); }));
router.post('/radiomics', asyncH((req, res) => { const r = f.radiomics(req.body || {}); res.json({ ok: true, op: 'radiomics', result: r }); }));
module.exports = router;
