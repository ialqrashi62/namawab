const express = require('express');
const router = express.Router();
const { funcs } = require('./tier132_endo_678_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/diabetes_mgmt', asyncH((req, res) => { const r = f.diabetes_mgmt(req.body || {}); res.json({ ok: true, op: 'diabetes_mgmt', result: r }); }));
router.post('/thyroid', asyncH((req, res) => { const r = f.thyroid(req.body || {}); res.json({ ok: true, op: 'thyroid', result: r }); }));
router.post('/adrenal', asyncH((req, res) => { const r = f.adrenal(req.body || {}); res.json({ ok: true, op: 'adrenal', result: r }); }));
router.post('/reproductive_endocrine', asyncH((req, res) => { const r = f.reproductive_endocrine(req.body || {}); res.json({ ok: true, op: 'reproductive_endocrine', result: r }); }));
router.post('/bone_density', asyncH((req, res) => { const r = f.bone_density(req.body || {}); res.json({ ok: true, op: 'bone_density', result: r }); }));
module.exports = router;
