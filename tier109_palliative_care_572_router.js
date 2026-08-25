const express = require('express');
const router = express.Router();
const { funcs } = require('./tier109_palliative_care_572_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/palliative_assessment', asyncH((req, res) => { const r = f.palliative_assessment(req.body || {}); res.json({ ok: true, op: 'palliative_assessment', result: r }); }));
router.post('/symptom_management', asyncH((req, res) => { const r = f.symptom_management(req.body || {}); res.json({ ok: true, op: 'symptom_management', result: r }); }));
router.post('/goals_of_care', asyncH((req, res) => { const r = f.goals_of_care(req.body || {}); res.json({ ok: true, op: 'goals_of_care', result: r }); }));
router.post('/hospice_referral', asyncH((req, res) => { const r = f.hospice_referral(req.body || {}); res.json({ ok: true, op: 'hospice_referral', result: r }); }));
router.post('/bereavement', asyncH((req, res) => { const r = f.bereavement(req.body || {}); res.json({ ok: true, op: 'bereavement', result: r }); }));
module.exports = router;
