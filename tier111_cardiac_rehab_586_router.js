const express = require('express');
const router = express.Router();
const { funcs } = require('./tier111_cardiac_rehab_586_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/enrollment', asyncH((req, res) => { const r = f.enrollment(req.body || {}); res.json({ ok: true, op: 'enrollment', result: r }); }));
router.post('/exercise_session', asyncH((req, res) => { const r = f.exercise_session(req.body || {}); res.json({ ok: true, op: 'exercise_session', result: r }); }));
router.post('/education', asyncH((req, res) => { const r = f.education(req.body || {}); res.json({ ok: true, op: 'education', result: r }); }));
router.post('/outcome_assessment', asyncH((req, res) => { const r = f.outcome_assessment(req.body || {}); res.json({ ok: true, op: 'outcome_assessment', result: r }); }));
router.post('/completion', asyncH((req, res) => { const r = f.completion(req.body || {}); res.json({ ok: true, op: 'completion', result: r }); }));
module.exports = router;
