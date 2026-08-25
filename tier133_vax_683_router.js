const express = require('express');
const router = express.Router();
const { funcs } = require('./tier133_vax_683_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/vaccine_admin', asyncH((req, res) => { const r = f.vaccine_admin(req.body || {}); res.json({ ok: true, op: 'vaccine_admin', result: r }); }));
router.post('/schedule_recommend', asyncH((req, res) => { const r = f.schedule_recommend(req.body || {}); res.json({ ok: true, op: 'schedule_recommend', result: r }); }));
router.post('/adverse_event', asyncH((req, res) => { const r = f.adverse_event(req.body || {}); res.json({ ok: true, op: 'adverse_event', result: r }); }));
router.post('/contraindication', asyncH((req, res) => { const r = f.contraindication(req.body || {}); res.json({ ok: true, op: 'contraindication', result: r }); }));
router.post('/coverage_report', asyncH((req, res) => { const r = f.coverage_report(req.body || {}); res.json({ ok: true, op: 'coverage_report', result: r }); }));
module.exports = router;