const express = require('express');
const router = express.Router();
const { funcs } = require('./tier144_ger_687_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cga', asyncH((req, res) => { const r = f.cga(req.body || {}); res.json({ ok: true, op: 'cga', result: r }); }));
router.post('/frailty', asyncH((req, res) => { const r = f.frailty(req.body || {}); res.json({ ok: true, op: 'frailty', result: r }); }));
router.post('/polypharm', asyncH((req, res) => { const r = f.polypharm(req.body || {}); res.json({ ok: true, op: 'polypharm', result: r }); }));
router.post('/geriatric_syn', asyncH((req, res) => { const r = f.geriatric_syn(req.body || {}); res.json({ ok: true, op: 'geriatric_syn', result: r }); }));
router.post('/goals', asyncH((req, res) => { const r = f.goals(req.body || {}); res.json({ ok: true, op: 'goals', result: r }); }));
module.exports = router;