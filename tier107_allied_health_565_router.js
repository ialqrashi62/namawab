const express = require('express');
const router = express.Router();
const { funcs } = require('./tier107_allied_health_565_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/physical_therapy', asyncH((req, res) => { const r = f.physical_therapy(req.body || {}); res.json({ ok: true, op: 'physical_therapy', result: r }); }));
router.post('/occupational_therapy', asyncH((req, res) => { const r = f.occupational_therapy(req.body || {}); res.json({ ok: true, op: 'occupational_therapy', result: r }); }));
router.post('/speech_therapy', asyncH((req, res) => { const r = f.speech_therapy(req.body || {}); res.json({ ok: true, op: 'speech_therapy', result: r }); }));
router.post('/respiratory_therapy', asyncH((req, res) => { const r = f.respiratory_therapy(req.body || {}); res.json({ ok: true, op: 'respiratory_therapy', result: r }); }));
router.post('/dietary_consult', asyncH((req, res) => { const r = f.dietary_consult(req.body || {}); res.json({ ok: true, op: 'dietary_consult', result: r }); }));
module.exports = router;
