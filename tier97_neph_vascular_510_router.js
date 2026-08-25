const express = require('express');
const router = express.Router();
const { funcs } = require('./tier97_neph_vascular_510_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/renovascular', asyncH((req, res) => { const r = f.renovascular(req.body || {}); res.json({ ok: true, op: 'renovascular', result: r }); }));
router.post('/htn_renal', asyncH((req, res) => { const r = f.htn_renal(req.body || {}); res.json({ ok: true, op: 'htn_renal', result: r }); }));
router.post('/cardiorenal', asyncH((req, res) => { const r = f.cardiorenal(req.body || {}); res.json({ ok: true, op: 'cardiorenal', result: r }); }));
router.post('/hepatorenal', asyncH((req, res) => { const r = f.hepatorenal(req.body || {}); res.json({ ok: true, op: 'hepatorenal', result: r }); }));
router.post('/obstructive_uropathy', asyncH((req, res) => { const r = f.obstructive_uropathy(req.body || {}); res.json({ ok: true, op: 'obstructive_uropathy', result: r }); }));
module.exports = router;
