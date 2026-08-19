const express = require('express');
const router = express.Router();
const { funcs } = require('./tier108_ultrasound_advanced_568_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/echo_complete', asyncH((req, res) => { const r = f.echo_complete(req.body || {}); res.json({ ok: true, op: 'echo_complete', result: r }); }));
router.post('/vascular_duplex', asyncH((req, res) => { const r = f.vascular_duplex(req.body || {}); res.json({ ok: true, op: 'vascular_duplex', result: r }); }));
router.post('/point_of_care_us', asyncH((req, res) => { const r = f.point_of_care_us(req.body || {}); res.json({ ok: true, op: 'point_of_care_us', result: r }); }));
router.post('/elastography', asyncH((req, res) => { const r = f.elastography(req.body || {}); res.json({ ok: true, op: 'elastography', result: r }); }));
router.post('/contrast_echo', asyncH((req, res) => { const r = f.contrast_echo(req.body || {}); res.json({ ok: true, op: 'contrast_echo', result: r }); }));
module.exports = router;
