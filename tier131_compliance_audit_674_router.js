const express = require('express');
const router = express.Router();
const { funcs } = require('./tier131_compliance_audit_674_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/regulatory', asyncH((req, res) => { const r = f.regulatory(req.body || {}); res.json({ ok: true, op: 'regulatory', result: r }); }));
router.post('/audit_finding', asyncH((req, res) => { const r = f.audit_finding(req.body || {}); res.json({ ok: true, op: 'audit_finding', result: r }); }));
router.post('/corrective_action', asyncH((req, res) => { const r = f.corrective_action(req.body || {}); res.json({ ok: true, op: 'corrective_action', result: r }); }));
router.post('/risk_assessment', asyncH((req, res) => { const r = f.risk_assessment(req.body || {}); res.json({ ok: true, op: 'risk_assessment', result: r }); }));
router.post('/policy_attestation', asyncH((req, res) => { const r = f.policy_attestation(req.body || {}); res.json({ ok: true, op: 'policy_attestation', result: r }); }));
module.exports = router;
