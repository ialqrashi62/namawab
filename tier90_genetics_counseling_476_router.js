const express = require('express');
const router = express.Router();
const { funcs } = require('./tier90_genetics_counseling_476_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pretest_counseling', asyncH((req, res) => { const r = f.pretest_counseling(req.body || {}); res.json({ ok: true, op: 'pretest_counseling', result: r }); }));
router.post('/results_disclosure', asyncH((req, res) => { const r = f.results_disclosure(req.body || {}); res.json({ ok: true, op: 'results_disclosure', result: r }); }));
router.post('/psychosocial_support', asyncH((req, res) => { const r = f.psychosocial_support(req.body || {}); res.json({ ok: true, op: 'psychosocial_support', result: r }); }));
router.post('/cascade_screening', asyncH((req, res) => { const r = f.cascade_screening(req.body || {}); res.json({ ok: true, op: 'cascade_screening', result: r }); }));
router.post('/reproductive_counseling', asyncH((req, res) => { const r = f.reproductive_counseling(req.body || {}); res.json({ ok: true, op: 'reproductive_counseling', result: r }); }));
module.exports = router;
