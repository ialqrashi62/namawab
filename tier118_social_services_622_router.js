const express = require('express');
const router = express.Router();
const { funcs } = require('./tier118_social_services_622_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/psychosocial_assessment', asyncH((req, res) => { const r = f.psychosocial_assessment(req.body || {}); res.json({ ok: true, op: 'psychosocial_assessment', result: r }); }));
router.post('/discharge_planning_social', asyncH((req, res) => { const r = f.discharge_planning_social(req.body || {}); res.json({ ok: true, op: 'discharge_planning_social', result: r }); }));
router.post('/abuse_screening', asyncH((req, res) => { const r = f.abuse_screening(req.body || {}); res.json({ ok: true, op: 'abuse_screening', result: r }); }));
router.post('/financial_counseling', asyncH((req, res) => { const r = f.financial_counseling(req.body || {}); res.json({ ok: true, op: 'financial_counseling', result: r }); }));
router.post('/community_resource', asyncH((req, res) => { const r = f.community_resource(req.body || {}); res.json({ ok: true, op: 'community_resource', result: r }); }));
module.exports = router;
