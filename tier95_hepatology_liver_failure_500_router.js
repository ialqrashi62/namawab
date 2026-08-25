const express = require('express');
const router = express.Router();
const { funcs } = require('./tier95_hepatology_liver_failure_500_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/acute_liver_failure', asyncH((req, res) => { const r = f.acute_liver_failure(req.body || {}); res.json({ ok: true, op: 'acute_liver_failure', result: r }); }));
router.post('/decompensated_cirrhosis', asyncH((req, res) => { const r = f.decompensated_cirrhosis(req.body || {}); res.json({ ok: true, op: 'decompensated_cirrhosis', result: r }); }));
router.post('/transplant_evaluation', asyncH((req, res) => { const r = f.transplant_evaluation(req.body || {}); res.json({ ok: true, op: 'transplant_evaluation', result: r }); }));
router.post('/transplant_followup', asyncH((req, res) => { const r = f.transplant_followup(req.body || {}); res.json({ ok: true, op: 'transplant_followup', result: r }); }));
router.post('/liver_cancer', asyncH((req, res) => { const r = f.liver_cancer(req.body || {}); res.json({ ok: true, op: 'liver_cancer', result: r }); }));
module.exports = router;
