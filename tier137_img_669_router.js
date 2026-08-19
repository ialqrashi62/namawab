const express = require('express');
const router = express.Router();
const { funcs } = require('./tier137_img_669_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cnn_inference', asyncH((req, res) => { const r = f.cnn_inference(req.body || {}); res.json({ ok: true, op: 'cnn_inference', result: r }); }));
router.post('/lesion_detect', asyncH((req, res) => { const r = f.lesion_detect(req.body || {}); res.json({ ok: true, op: 'lesion_detect', result: r }); }));
router.post('/segmentation', asyncH((req, res) => { const r = f.segmentation(req.body || {}); res.json({ ok: true, op: 'segmentation', result: r }); }));
router.post('/registration', asyncH((req, res) => { const r = f.registration(req.body || {}); res.json({ ok: true, op: 'registration', result: r }); }));
router.post('/triage', asyncH((req, res) => { const r = f.triage(req.body || {}); res.json({ ok: true, op: 'triage', result: r }); }));
module.exports = router;