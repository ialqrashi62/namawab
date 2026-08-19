const express = require('express');
const router = express.Router();
const { funcs } = require('./tier142_sm_678_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/preparticipation', asyncH((req, res) => { const r = f.preparticipation(req.body || {}); res.json({ ok: true, op: 'preparticipation', result: r }); }));
router.post('/injury_assess', asyncH((req, res) => { const r = f.injury_assess(req.body || {}); res.json({ ok: true, op: 'injury_assess', result: r }); }));
router.post('/concussion', asyncH((req, res) => { const r = f.concussion(req.body || {}); res.json({ ok: true, op: 'concussion', result: r }); }));
router.post('/rehab', asyncH((req, res) => { const r = f.rehab(req.body || {}); res.json({ ok: true, op: 'rehab', result: r }); }));
router.post('/performance', asyncH((req, res) => { const r = f.performance(req.body || {}); res.json({ ok: true, op: 'performance', result: r }); }));
module.exports = router;