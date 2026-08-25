const express = require('express');
const router = express.Router();
const { funcs } = require('./tier99_perioperative_520_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/preanesthetic_eval', asyncH((req, res) => { const r = f.preanesthetic_eval(req.body || {}); res.json({ ok: true, op: 'preanesthetic_eval', result: r }); }));
router.post('/intraoperative_monitoring', asyncH((req, res) => { const r = f.intraoperative_monitoring(req.body || {}); res.json({ ok: true, op: 'intraoperative_monitoring', result: r }); }));
router.post('/pacu', asyncH((req, res) => { const r = f.pacu(req.body || {}); res.json({ ok: true, op: 'pacu', result: r }); }));
router.post('/postop_complications', asyncH((req, res) => { const r = f.postop_complications(req.body || {}); res.json({ ok: true, op: 'postop_complications', result: r }); }));
router.post('/enhanced_recovery', asyncH((req, res) => { const r = f.enhanced_recovery(req.body || {}); res.json({ ok: true, op: 'enhanced_recovery', result: r }); }));
module.exports = router;
