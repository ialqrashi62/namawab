const express = require('express');
const router = express.Router();
const { funcs } = require('./tier109_spine_care_573_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/spine_assessment', asyncH((req, res) => { const r = f.spine_assessment(req.body || {}); res.json({ ok: true, op: 'spine_assessment', result: r }); }));
router.post('/conservative_treatment', asyncH((req, res) => { const r = f.conservative_treatment(req.body || {}); res.json({ ok: true, op: 'conservative_treatment', result: r }); }));
router.post('/spine_injection', asyncH((req, res) => { const r = f.spine_injection(req.body || {}); res.json({ ok: true, op: 'spine_injection', result: r }); }));
router.post('/spine_surgery', asyncH((req, res) => { const r = f.spine_surgery(req.body || {}); res.json({ ok: true, op: 'spine_surgery', result: r }); }));
router.post('/post_op_spine', asyncH((req, res) => { const r = f.post_op_spine(req.body || {}); res.json({ ok: true, op: 'post_op_spine', result: r }); }));
module.exports = router;
