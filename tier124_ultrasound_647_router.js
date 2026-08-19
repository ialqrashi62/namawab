const express = require('express');
const router = express.Router();
const { funcs } = require('./tier124_ultrasound_647_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/abdominal_us', asyncH((req, res) => { const r = f.abdominal_us(req.body || {}); res.json({ ok: true, op: 'abdominal_us', result: r }); }));
router.post('/vascular_us', asyncH((req, res) => { const r = f.vascular_us(req.body || {}); res.json({ ok: true, op: 'vascular_us', result: r }); }));
router.post('/obstetric_us', asyncH((req, res) => { const r = f.obstetric_us(req.body || {}); res.json({ ok: true, op: 'obstetric_us', result: r }); }));
router.post('/echo_us', asyncH((req, res) => { const r = f.echo_us(req.body || {}); res.json({ ok: true, op: 'echo_us', result: r }); }));
router.post('/msk_us', asyncH((req, res) => { const r = f.msk_us(req.body || {}); res.json({ ok: true, op: 'msk_us', result: r }); }));
module.exports = router;
