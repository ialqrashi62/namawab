const express = require('express');
const router = express.Router();
const { funcs } = require('./tier107_wound_care_563_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/wound_assessment', asyncH((req, res) => { const r = f.wound_assessment(req.body || {}); res.json({ ok: true, op: 'wound_assessment', result: r }); }));
router.post('/dressing_change', asyncH((req, res) => { const r = f.dressing_change(req.body || {}); res.json({ ok: true, op: 'dressing_change', result: r }); }));
router.post('/pressure_injury', asyncH((req, res) => { const r = f.pressure_injury(req.body || {}); res.json({ ok: true, op: 'pressure_injury', result: r }); }));
router.post('/ostomy_care', asyncH((req, res) => { const r = f.ostomy_care(req.body || {}); res.json({ ok: true, op: 'ostomy_care', result: r }); }));
router.post('/wound_healing', asyncH((req, res) => { const r = f.wound_healing(req.body || {}); res.json({ ok: true, op: 'wound_healing', result: r }); }));
module.exports = router;
