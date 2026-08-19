const express = require('express');
const router = express.Router();
const { funcs } = require('./tier132_pulm_677_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pft', asyncH((req, res) => { const r = f.pft(req.body || {}); res.json({ ok: true, op: 'pft', result: r }); }));
router.post('/sleep_study', asyncH((req, res) => { const r = f.sleep_study(req.body || {}); res.json({ ok: true, op: 'sleep_study', result: r }); }));
router.post('/vent_weaning', asyncH((req, res) => { const r = f.vent_weaning(req.body || {}); res.json({ ok: true, op: 'vent_weaning', result: r }); }));
router.post('/tb_screening', asyncH((req, res) => { const r = f.tb_screening(req.body || {}); res.json({ ok: true, op: 'tb_screening', result: r }); }));
router.post('/oxygen_therapy', asyncH((req, res) => { const r = f.oxygen_therapy(req.body || {}); res.json({ ok: true, op: 'oxygen_therapy', result: r }); }));
module.exports = router;
