const express = require('express');
const router = express.Router();
const { funcs } = require('./tier102_surg_transplant_537_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/transplant_evaluation', asyncH((req, res) => { const r = f.transplant_evaluation(req.body || {}); res.json({ ok: true, op: 'transplant_evaluation', result: r }); }));
router.post('/transplant_surgery', asyncH((req, res) => { const r = f.transplant_surgery(req.body || {}); res.json({ ok: true, op: 'transplant_surgery', result: r }); }));
router.post('/post_transplant', asyncH((req, res) => { const r = f.post_transplant(req.body || {}); res.json({ ok: true, op: 'post_transplant', result: r }); }));
router.post('/donor_workup', asyncH((req, res) => { const r = f.donor_workup(req.body || {}); res.json({ ok: true, op: 'donor_workup', result: r }); }));
router.post('/immunosuppression', asyncH((req, res) => { const r = f.immunosuppression(req.body || {}); res.json({ ok: true, op: 'immunosuppression', result: r }); }));
module.exports = router;
