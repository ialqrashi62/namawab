const express = require('express');
const router = express.Router();
const { funcs } = require('./tier96_diabetes_t2dm_504_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/t2dm_management', asyncH((req, res) => { const r = f.t2dm_management(req.body || {}); res.json({ ok: true, op: 't2dm_management', result: r }); }));
router.post('/oral_agents', asyncH((req, res) => { const r = f.oral_agents(req.body || {}); res.json({ ok: true, op: 'oral_agents', result: r }); }));
router.post('/injectable_therapy', asyncH((req, res) => { const r = f.injectable_therapy(req.body || {}); res.json({ ok: true, op: 'injectable_therapy', result: r }); }));
router.post('/diabetes_complications', asyncH((req, res) => { const r = f.diabetes_complications(req.body || {}); res.json({ ok: true, op: 'diabetes_complications', result: r }); }));
router.post('/gestational_diabetes', asyncH((req, res) => { const r = f.gestational_diabetes(req.body || {}); res.json({ ok: true, op: 'gestational_diabetes', result: r }); }));
module.exports = router;
