const express = require('express');
const router = express.Router();
const { funcs } = require('./tier99_oncology_extended_522_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/tumor_board', asyncH((req, res) => { const r = f.tumor_board(req.body || {}); res.json({ ok: true, op: 'tumor_board', result: r }); }));
router.post('/molecular_profiling', asyncH((req, res) => { const r = f.molecular_profiling(req.body || {}); res.json({ ok: true, op: 'molecular_profiling', result: r }); }));
router.post('/clinical_trial', asyncH((req, res) => { const r = f.clinical_trial(req.body || {}); res.json({ ok: true, op: 'clinical_trial', result: r }); }));
router.post('/survivorship_followup', asyncH((req, res) => { const r = f.survivorship_followup(req.body || {}); res.json({ ok: true, op: 'survivorship_followup', result: r }); }));
router.post('/hospice_referral', asyncH((req, res) => { const r = f.hospice_referral(req.body || {}); res.json({ ok: true, op: 'hospice_referral', result: r }); }));
module.exports = router;
