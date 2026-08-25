const express = require('express');
const router = express.Router();
const { funcs } = require('./tier131_workflow_advanced_672_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/care_pathway', asyncH((req, res) => { const r = f.care_pathway(req.body || {}); res.json({ ok: true, op: 'care_pathway', result: r }); }));
router.post('/task_assignment', asyncH((req, res) => { const r = f.task_assignment(req.body || {}); res.json({ ok: true, op: 'task_assignment', result: r }); }));
router.post('/escalation', asyncH((req, res) => { const r = f.escalation(req.body || {}); res.json({ ok: true, op: 'escalation', result: r }); }));
router.post('/handoff', asyncH((req, res) => { const r = f.handoff(req.body || {}); res.json({ ok: true, op: 'handoff', result: r }); }));
router.post('/discharge_summary', asyncH((req, res) => { const r = f.discharge_summary(req.body || {}); res.json({ ok: true, op: 'discharge_summary', result: r }); }));
module.exports = router;
