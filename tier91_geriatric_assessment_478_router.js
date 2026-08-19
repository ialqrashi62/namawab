const express = require('express');
const router = express.Router();
const { funcs } = require('./tier91_geriatric_assessment_478_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/comprehensive_assessment', asyncH((req, res) => { const r = f.comprehensive_assessment(req.body || {}); res.json({ ok: true, op: 'comprehensive_assessment', result: r }); }));
router.post('/adl_iadl', asyncH((req, res) => { const r = f.adl_iadl(req.body || {}); res.json({ ok: true, op: 'adl_iadl', result: r }); }));
router.post('/cognitive_screening', asyncH((req, res) => { const r = f.cognitive_screening(req.body || {}); res.json({ ok: true, op: 'cognitive_screening', result: r }); }));
router.post('/functional_status', asyncH((req, res) => { const r = f.functional_status(req.body || {}); res.json({ ok: true, op: 'functional_status', result: r }); }));
router.post('/social_assessment', asyncH((req, res) => { const r = f.social_assessment(req.body || {}); res.json({ ok: true, op: 'social_assessment', result: r }); }));
module.exports = router;
