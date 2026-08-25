const express = require('express');
const router = express.Router();
const { funcs } = require('./tier89_oncology_survivorship_472_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/survivorship_plan', asyncH((req, res) => { const r = f.survivorship_plan(req.body || {}); res.json({ ok: true, op: 'survivorship_plan', result: r }); }));
router.post('/late_effects', asyncH((req, res) => { const r = f.late_effects(req.body || {}); res.json({ ok: true, op: 'late_effects', result: r }); }));
router.post('/screening_recurrence', asyncH((req, res) => { const r = f.screening_recurrence(req.body || {}); res.json({ ok: true, op: 'screening_recurrence', result: r }); }));
router.post('/lifestyle_counseling', asyncH((req, res) => { const r = f.lifestyle_counseling(req.body || {}); res.json({ ok: true, op: 'lifestyle_counseling', result: r }); }));
router.post('/followup_schedule', asyncH((req, res) => { const r = f.followup_schedule(req.body || {}); res.json({ ok: true, op: 'followup_schedule', result: r }); }));
module.exports = router;
