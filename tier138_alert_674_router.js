const express = require('express');
const router = express.Router();
const { funcs } = require('./tier138_alert_674_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/smart_alert', asyncH((req, res) => { const r = f.smart_alert(req.body || {}); res.json({ ok: true, op: 'smart_alert', result: r }); }));
router.post('/rule_engine', asyncH((req, res) => { const r = f.rule_engine(req.body || {}); res.json({ ok: true, op: 'rule_engine', result: r }); }));
router.post('/suppression', asyncH((req, res) => { const r = f.suppression(req.body || {}); res.json({ ok: true, op: 'suppression', result: r }); }));
router.post('/escalation', asyncH((req, res) => { const r = f.escalation(req.body || {}); res.json({ ok: true, op: 'escalation', result: r }); }));
router.post('/feedback', asyncH((req, res) => { const r = f.feedback(req.body || {}); res.json({ ok: true, op: 'feedback', result: r }); }));
module.exports = router;