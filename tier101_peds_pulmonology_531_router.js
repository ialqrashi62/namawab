const express = require('express');
const router = express.Router();
const { funcs } = require('./tier101_peds_pulmonology_531_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/asthma_peds', asyncH((req, res) => { const r = f.asthma_peds(req.body || {}); res.json({ ok: true, op: 'asthma_peds', result: r }); }));
router.post('/cf_followup', asyncH((req, res) => { const r = f.cf_followup(req.body || {}); res.json({ ok: true, op: 'cf_followup', result: r }); }));
router.post('/bronchopulmonary_dysplasia', asyncH((req, res) => { const r = f.bronchopulmonary_dysplasia(req.body || {}); res.json({ ok: true, op: 'bronchopulmonary_dysplasia', result: r }); }));
router.post('/sleep_peds', asyncH((req, res) => { const r = f.sleep_peds(req.body || {}); res.json({ ok: true, op: 'sleep_peds', result: r }); }));
router.post('/peds_bronchoscopy', asyncH((req, res) => { const r = f.peds_bronchoscopy(req.body || {}); res.json({ ok: true, op: 'peds_bronchoscopy', result: r }); }));
module.exports = router;
