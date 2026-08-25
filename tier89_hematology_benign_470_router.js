const express = require('express');
const router = express.Router();
const { funcs } = require('./tier89_hematology_benign_470_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/anemia_workup', asyncH((req, res) => { const r = f.anemia_workup(req.body || {}); res.json({ ok: true, op: 'anemia_workup', result: r }); }));
router.post('/iron_deficiency', asyncH((req, res) => { const r = f.iron_deficiency(req.body || {}); res.json({ ok: true, op: 'iron_deficiency', result: r }); }));
router.post('/hemolysis_workup', asyncH((req, res) => { const r = f.hemolysis_workup(req.body || {}); res.json({ ok: true, op: 'hemolysis_workup', result: r }); }));
router.post('/bone_marrow', asyncH((req, res) => { const r = f.bone_marrow(req.body || {}); res.json({ ok: true, op: 'bone_marrow', result: r }); }));
router.post('/anticoagulation', asyncH((req, res) => { const r = f.anticoagulation(req.body || {}); res.json({ ok: true, op: 'anticoagulation', result: r }); }));
module.exports = router;
