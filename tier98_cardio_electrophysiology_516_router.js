const express = require('express');
const router = express.Router();
const { funcs } = require('./tier98_cardio_electrophysiology_516_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pacemaker_followup', asyncH((req, res) => { const r = f.pacemaker_followup(req.body || {}); res.json({ ok: true, op: 'pacemaker_followup', result: r }); }));
router.post('/icd_followup', asyncH((req, res) => { const r = f.icd_followup(req.body || {}); res.json({ ok: true, op: 'icd_followup', result: r }); }));
router.post('/anticoagulation_cardio', asyncH((req, res) => { const r = f.anticoagulation_cardio(req.body || {}); res.json({ ok: true, op: 'anticoagulation_cardio', result: r }); }));
router.post('/lipid_management', asyncH((req, res) => { const r = f.lipid_management(req.body || {}); res.json({ ok: true, op: 'lipid_management', result: r }); }));
router.post('/cardiac_rehab', asyncH((req, res) => { const r = f.cardiac_rehab(req.body || {}); res.json({ ok: true, op: 'cardiac_rehab', result: r }); }));
module.exports = router;
