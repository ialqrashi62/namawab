const express = require('express');
const router = express.Router();
const { funcs } = require('./tier136_card_692_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cath_lab', asyncH((req, res) => { const r = f.cath_lab(req.body || {}); res.json({ ok: true, op: 'cath_lab', result: r }); }));
router.post('/stress_test', asyncH((req, res) => { const r = f.stress_test(req.body || {}); res.json({ ok: true, op: 'stress_test', result: r }); }));
router.post('/echo_study', asyncH((req, res) => { const r = f.echo_study(req.body || {}); res.json({ ok: true, op: 'echo_study', result: r }); }));
router.post('/device_check', asyncH((req, res) => { const r = f.device_check(req.body || {}); res.json({ ok: true, op: 'device_check', result: r }); }));
router.post('/ablation_ep', asyncH((req, res) => { const r = f.ablation_ep(req.body || {}); res.json({ ok: true, op: 'ablation_ep', result: r }); }));
module.exports = router;