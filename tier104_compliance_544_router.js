const express = require('express');
const router = express.Router();
const { funcs } = require('./tier104_compliance_544_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/regulatory_compliance', asyncH((req, res) => { const r = f.regulatory_compliance(req.body || {}); res.json({ ok: true, op: 'regulatory_compliance', result: r }); }));
router.post('/audit_response', asyncH((req, res) => { const r = f.audit_response(req.body || {}); res.json({ ok: true, op: 'audit_response', result: r }); }));
router.post('/policy_management', asyncH((req, res) => { const r = f.policy_management(req.body || {}); res.json({ ok: true, op: 'policy_management', result: r }); }));
router.post('/training_compliance', asyncH((req, res) => { const r = f.training_compliance(req.body || {}); res.json({ ok: true, op: 'training_compliance', result: r }); }));
router.post('/incident_reporting', asyncH((req, res) => { const r = f.incident_reporting(req.body || {}); res.json({ ok: true, op: 'incident_reporting', result: r }); }));
module.exports = router;
