const express = require('express');
const router = express.Router();
const { funcs } = require('./tier109_sleep_medicine_575_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/sleep_assessment', asyncH((req, res) => { const r = f.sleep_assessment(req.body || {}); res.json({ ok: true, op: 'sleep_assessment', result: r }); }));
router.post('/polysomnography', asyncH((req, res) => { const r = f.polysomnography(req.body || {}); res.json({ ok: true, op: 'polysomnography', result: r }); }));
router.post('/cpap_titration', asyncH((req, res) => { const r = f.cpap_titration(req.body || {}); res.json({ ok: true, op: 'cpap_titration', result: r }); }));
router.post('/insomnia_treatment', asyncH((req, res) => { const r = f.insomnia_treatment(req.body || {}); res.json({ ok: true, op: 'insomnia_treatment', result: r }); }));
router.post('/sleep_followup', asyncH((req, res) => { const r = f.sleep_followup(req.body || {}); res.json({ ok: true, op: 'sleep_followup', result: r }); }));
module.exports = router;
