const express = require('express');
const router = express.Router();
const { funcs } = require('./tier89_oncology_support_471_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/palliative_care', asyncH((req, res) => { const r = f.palliative_care(req.body || {}); res.json({ ok: true, op: 'palliative_care', result: r }); }));
router.post('/pain_management', asyncH((req, res) => { const r = f.pain_management(req.body || {}); res.json({ ok: true, op: 'pain_management', result: r }); }));
router.post('/psychosocial_support', asyncH((req, res) => { const r = f.psychosocial_support(req.body || {}); res.json({ ok: true, op: 'psychosocial_support', result: r }); }));
router.post('/goals_of_care', asyncH((req, res) => { const r = f.goals_of_care(req.body || {}); res.json({ ok: true, op: 'goals_of_care', result: r }); }));
router.post('/nutrition_support', asyncH((req, res) => { const r = f.nutrition_support(req.body || {}); res.json({ ok: true, op: 'nutrition_support', result: r }); }));
module.exports = router;
