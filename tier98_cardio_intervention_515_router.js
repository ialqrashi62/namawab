const express = require('express');
const router = express.Router();
const { funcs } = require('./tier98_cardio_intervention_515_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pci', asyncH((req, res) => { const r = f.pci(req.body || {}); res.json({ ok: true, op: 'pci', result: r }); }));
router.post('/cabg', asyncH((req, res) => { const r = f.cabg(req.body || {}); res.json({ ok: true, op: 'cabg', result: r }); }));
router.post('/device_implant', asyncH((req, res) => { const r = f.device_implant(req.body || {}); res.json({ ok: true, op: 'device_implant', result: r }); }));
router.post('/ablation', asyncH((req, res) => { const r = f.ablation(req.body || {}); res.json({ ok: true, op: 'ablation', result: r }); }));
router.post('/tavr', asyncH((req, res) => { const r = f.tavr(req.body || {}); res.json({ ok: true, op: 'tavr', result: r }); }));
module.exports = router;
