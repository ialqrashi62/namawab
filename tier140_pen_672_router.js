const express = require('express');
const router = express.Router();
const { funcs } = require('./tier140_pen_672_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pentest_target', asyncH((req, res) => { const r = f.pentest_target(req.body || {}); res.json({ ok: true, op: 'pentest_target', result: r }); }));
router.post('/vuln_scan', asyncH((req, res) => { const r = f.vuln_scan(req.body || {}); res.json({ ok: true, op: 'vuln_scan', result: r }); }));
router.post('/exploit_chain', asyncH((req, res) => { const r = f.exploit_chain(req.body || {}); res.json({ ok: true, op: 'exploit_chain', result: r }); }));
router.post('/auth_attack', asyncH((req, res) => { const r = f.auth_attack(req.body || {}); res.json({ ok: true, op: 'auth_attack', result: r }); }));
router.post('/report', asyncH((req, res) => { const r = f.report(req.body || {}); res.json({ ok: true, op: 'report', result: r }); }));
module.exports = router;