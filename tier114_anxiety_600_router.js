const express = require('express');
const router = express.Router();
const { funcs } = require('./tier114_anxiety_600_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/gad', asyncH((req, res) => { const r = f.gad(req.body || {}); res.json({ ok: true, op: 'gad', result: r }); }));
router.post('/panic_disorder', asyncH((req, res) => { const r = f.panic_disorder(req.body || {}); res.json({ ok: true, op: 'panic_disorder', result: r }); }));
router.post('/social_anxiety', asyncH((req, res) => { const r = f.social_anxiety(req.body || {}); res.json({ ok: true, op: 'social_anxiety', result: r }); }));
router.post('/phobia', asyncH((req, res) => { const r = f.phobia(req.body || {}); res.json({ ok: true, op: 'phobia', result: r }); }));
router.post('/separation_anxiety', asyncH((req, res) => { const r = f.separation_anxiety(req.body || {}); res.json({ ok: true, op: 'separation_anxiety', result: r }); }));
module.exports = router;
