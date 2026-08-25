const express = require('express');
const router = express.Router();
const { funcs } = require('./tier116_rehab_engineering_613_engine.js');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/wheelchair_assessment', asyncH((req, res) => { const r = f.wheelchair_assessment(req.body || {}); res.json({ ok: true, op: 'wheelchair_assessment', result: r }); }));
router.post('/orthotic_fitting', asyncH((req, res) => { const r = f.orthotic_fitting(req.body || {}); res.json({ ok: true, op: 'orthotic_fitting', result: r }); }));
router.post('/prosthetic_assessment', asyncH((req, res) => { const r = f.prosthetic_assessment(req.body || {}); res.json({ ok: true, op: 'prosthetic_assessment', result: r }); }));
router.post('/adaptive_equipment', asyncH((req, res) => { const r = f.adaptive_equipment(req.body || {}); res.json({ ok: true, op: 'adaptive_equipment', result: r }); }));
router.post('/home_modifications', asyncH((req, res) => { const r = f.home_modifications(req.body || {}); res.json({ ok: true, op: 'home_modifications', result: r }); }));
module.exports = router;
