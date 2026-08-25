const express = require('express');
const router = express.Router();
const { funcs } = require('./tier91_geriatric_polypharmacy_480_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/medication_reconciliation', asyncH((req, res) => { const r = f.medication_reconciliation(req.body || {}); res.json({ ok: true, op: 'medication_reconciliation', result: r }); }));
router.post('/beers_criteria', asyncH((req, res) => { const r = f.beers_criteria(req.body || {}); res.json({ ok: true, op: 'beers_criteria', result: r }); }));
router.post('/deprescribing', asyncH((req, res) => { const r = f.deprescribing(req.body || {}); res.json({ ok: true, op: 'deprescribing', result: r }); }));
router.post('/adherence', asyncH((req, res) => { const r = f.adherence(req.body || {}); res.json({ ok: true, op: 'adherence', result: r }); }));
router.post('/prescribing_principles', asyncH((req, res) => { const r = f.prescribing_principles(req.body || {}); res.json({ ok: true, op: 'prescribing_principles', result: r }); }));
module.exports = router;
