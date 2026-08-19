const express = require('express');
const router = express.Router();
const { funcs } = require('./tier116_specialty_rehab_614_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/neuro_rehab', asyncH((req, res) => { const r = f.neuro_rehab(req.body || {}); res.json({ ok: true, op: 'neuro_rehab', result: r }); }));
router.post('/cardiac_rehab_phase1', asyncH((req, res) => { const r = f.cardiac_rehab_phase1(req.body || {}); res.json({ ok: true, op: 'cardiac_rehab_phase1', result: r }); }));
router.post('/pulmonary_rehab', asyncH((req, res) => { const r = f.pulmonary_rehab(req.body || {}); res.json({ ok: true, op: 'pulmonary_rehab', result: r }); }));
router.post('/burn_rehab', asyncH((req, res) => { const r = f.burn_rehab(req.body || {}); res.json({ ok: true, op: 'burn_rehab', result: r }); }));
router.post('/lymphedema', asyncH((req, res) => { const r = f.lymphedema(req.body || {}); res.json({ ok: true, op: 'lymphedema', result: r }); }));
module.exports = router;
