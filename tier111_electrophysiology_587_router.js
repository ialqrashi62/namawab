const express = require('express');
const router = express.Router();
const { funcs } = require('./tier111_electrophysiology_587_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ablation', asyncH((req, res) => { const r = f.ablation(req.body || {}); res.json({ ok: true, op: 'ablation', result: r }); }));
router.post('/device_check', asyncH((req, res) => { const r = f.device_check(req.body || {}); res.json({ ok: true, op: 'device_check', result: r }); }));
router.post('/afib_management', asyncH((req, res) => { const r = f.afib_management(req.body || {}); res.json({ ok: true, op: 'afib_management', result: r }); }));
router.post('/syncope_workup', asyncH((req, res) => { const r = f.syncope_workup(req.body || {}); res.json({ ok: true, op: 'syncope_workup', result: r }); }));
router.post('/icd_followup', asyncH((req, res) => { const r = f.icd_followup(req.body || {}); res.json({ ok: true, op: 'icd_followup', result: r }); }));
module.exports = router;
