const express = require('express');
const router = express.Router();
const { funcs } = require('./tier109_sports_medicine_574_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/sports_assessment', asyncH((req, res) => { const r = f.sports_assessment(req.body || {}); res.json({ ok: true, op: 'sports_assessment', result: r }); }));
router.post('/injury_treatment', asyncH((req, res) => { const r = f.injury_treatment(req.body || {}); res.json({ ok: true, op: 'injury_treatment', result: r }); }));
router.post('/rehabilitation', asyncH((req, res) => { const r = f.rehabilitation(req.body || {}); res.json({ ok: true, op: 'rehabilitation', result: r }); }));
router.post('/return_to_play', asyncH((req, res) => { const r = f.return_to_play(req.body || {}); res.json({ ok: true, op: 'return_to_play', result: r }); }));
router.post('/concussion', asyncH((req, res) => { const r = f.concussion(req.body || {}); res.json({ ok: true, op: 'concussion', result: r }); }));
module.exports = router;
