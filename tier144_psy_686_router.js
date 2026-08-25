const express = require('express');
const router = express.Router();
const { funcs } = require('./tier144_psy_686_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ect', asyncH((req, res) => { const r = f.ect(req.body || {}); res.json({ ok: true, op: 'ect', result: r }); }));
router.post('/tms', asyncH((req, res) => { const r = f.tms(req.body || {}); res.json({ ok: true, op: 'tms', result: r }); }));
router.post('/ketamine', asyncH((req, res) => { const r = f.ketamine(req.body || {}); res.json({ ok: true, op: 'ketamine', result: r }); }));
router.post('/monitoring', asyncH((req, res) => { const r = f.monitoring(req.body || {}); res.json({ ok: true, op: 'monitoring', result: r }); }));
router.post('/community', asyncH((req, res) => { const r = f.community(req.body || {}); res.json({ ok: true, op: 'community', result: r }); }));
module.exports = router;