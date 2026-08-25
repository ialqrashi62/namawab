const express = require('express');
const router = express.Router();
const { funcs } = require('./tier143_dent_684_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/tooth_chart', asyncH((req, res) => { const r = f.tooth_chart(req.body || {}); res.json({ ok: true, op: 'tooth_chart', result: r }); }));
router.post('/period', asyncH((req, res) => { const r = f.period(req.body || {}); res.json({ ok: true, op: 'period', result: r }); }));
router.post('/caries', asyncH((req, res) => { const r = f.caries(req.body || {}); res.json({ ok: true, op: 'caries', result: r }); }));
router.post('/ortho', asyncH((req, res) => { const r = f.ortho(req.body || {}); res.json({ ok: true, op: 'ortho', result: r }); }));
router.post('/implant', asyncH((req, res) => { const r = f.implant(req.body || {}); res.json({ ok: true, op: 'implant', result: r }); }));
module.exports = router;