const express = require('express');
const router = express.Router();
const { funcs } = require('./tier100_obgyn_rei_525_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/infertility_workup', asyncH((req, res) => { const r = f.infertility_workup(req.body || {}); res.json({ ok: true, op: 'infertility_workup', result: r }); }));
router.post('/ovulation_induction', asyncH((req, res) => { const r = f.ovulation_induction(req.body || {}); res.json({ ok: true, op: 'ovulation_induction', result: r }); }));
router.post('/ivf_cycle', asyncH((req, res) => { const r = f.ivf_cycle(req.body || {}); res.json({ ok: true, op: 'ivf_cycle', result: r }); }));
router.post('/icsi', asyncH((req, res) => { const r = f.icsi(req.body || {}); res.json({ ok: true, op: 'icsi', result: r }); }));
router.post('/recurrent_pregnancy_loss', asyncH((req, res) => { const r = f.recurrent_pregnancy_loss(req.body || {}); res.json({ ok: true, op: 'recurrent_pregnancy_loss', result: r }); }));
module.exports = router;
