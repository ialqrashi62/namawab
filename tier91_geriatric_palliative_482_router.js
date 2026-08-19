const express = require('express');
const router = express.Router();
const { funcs } = require('./tier91_geriatric_palliative_482_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/advance_care_planning', asyncH((req, res) => { const r = f.advance_care_planning(req.body || {}); res.json({ ok: true, op: 'advance_care_planning', result: r }); }));
router.post('/frailty_assessment', asyncH((req, res) => { const r = f.frailty_assessment(req.body || {}); res.json({ ok: true, op: 'frailty_assessment', result: r }); }));
router.post('/nursing_home_placement', asyncH((req, res) => { const r = f.nursing_home_placement(req.body || {}); res.json({ ok: true, op: 'nursing_home_placement', result: r }); }));
router.post('/hospice_eligibility', asyncH((req, res) => { const r = f.hospice_eligibility(req.body || {}); res.json({ ok: true, op: 'hospice_eligibility', result: r }); }));
router.post('/goals_care_old', asyncH((req, res) => { const r = f.goals_care_old(req.body || {}); res.json({ ok: true, op: 'goals_care_old', result: r }); }));
module.exports = router;
