const express = require('express');
const router = express.Router();
const { funcs } = require('./tier113_maternal_medicine_596_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/preeclampsia_management', asyncH((req, res) => { const r = f.preeclampsia_management(req.body || {}); res.json({ ok: true, op: 'preeclampsia_management', result: r }); }));
router.post('/gestational_diabetes', asyncH((req, res) => { const r = f.gestational_diabetes(req.body || {}); res.json({ ok: true, op: 'gestational_diabetes', result: r }); }));
router.post('/thyroid_pregnancy', asyncH((req, res) => { const r = f.thyroid_pregnancy(req.body || {}); res.json({ ok: true, op: 'thyroid_pregnancy', result: r }); }));
router.post('/cardiac_pregnancy', asyncH((req, res) => { const r = f.cardiac_pregnancy(req.body || {}); res.json({ ok: true, op: 'cardiac_pregnancy', result: r }); }));
router.post('/antepartum_assessment', asyncH((req, res) => { const r = f.antepartum_assessment(req.body || {}); res.json({ ok: true, op: 'antepartum_assessment', result: r }); }));
module.exports = router;
