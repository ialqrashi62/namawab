const express = require('express');
const router = express.Router();
const { funcs } = require('./tier101_peds_picu_529_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/picu_admission', asyncH((req, res) => { const r = f.picu_admission(req.body || {}); res.json({ ok: true, op: 'picu_admission', result: r }); }));
router.post('/peds_septic_shock', asyncH((req, res) => { const r = f.peds_septic_shock(req.body || {}); res.json({ ok: true, op: 'peds_septic_shock', result: r }); }));
router.post('/status_asthmaticus', asyncH((req, res) => { const r = f.status_asthmaticus(req.body || {}); res.json({ ok: true, op: 'status_asthmaticus', result: r }); }));
router.post('/dka_pediatric', asyncH((req, res) => { const r = f.dka_pediatric(req.body || {}); res.json({ ok: true, op: 'dka_pediatric', result: r }); }));
router.post('/status_epilepticus', asyncH((req, res) => { const r = f.status_epilepticus(req.body || {}); res.json({ ok: true, op: 'status_epilepticus', result: r }); }));
module.exports = router;
