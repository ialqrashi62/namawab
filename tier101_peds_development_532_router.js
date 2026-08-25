const express = require('express');
const router = express.Router();
const { funcs } = require('./tier101_peds_development_532_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/developmental_screening', asyncH((req, res) => { const r = f.developmental_screening(req.body || {}); res.json({ ok: true, op: 'developmental_screening', result: r }); }));
router.post('/autism_screening', asyncH((req, res) => { const r = f.autism_screening(req.body || {}); res.json({ ok: true, op: 'autism_screening', result: r }); }));
router.post('/learning_disability', asyncH((req, res) => { const r = f.learning_disability(req.body || {}); res.json({ ok: true, op: 'learning_disability', result: r }); }));
router.post('/adhd_assessment', asyncH((req, res) => { const r = f.adhd_assessment(req.body || {}); res.json({ ok: true, op: 'adhd_assessment', result: r }); }));
router.post('/behavioral_assessment', asyncH((req, res) => { const r = f.behavioral_assessment(req.body || {}); res.json({ ok: true, op: 'behavioral_assessment', result: r }); }));
module.exports = router;
