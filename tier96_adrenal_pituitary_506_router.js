const express = require('express');
const router = express.Router();
const { funcs } = require('./tier96_adrenal_pituitary_506_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/adrenal_incidentaloma', asyncH((req, res) => { const r = f.adrenal_incidentaloma(req.body || {}); res.json({ ok: true, op: 'adrenal_incidentaloma', result: r }); }));
router.post('/pheochromocytoma', asyncH((req, res) => { const r = f.pheochromocytoma(req.body || {}); res.json({ ok: true, op: 'pheochromocytoma', result: r }); }));
router.post('/cushings', asyncH((req, res) => { const r = f.cushings(req.body || {}); res.json({ ok: true, op: 'cushings', result: r }); }));
router.post('/pituitary_adenoma', asyncH((req, res) => { const r = f.pituitary_adenoma(req.body || {}); res.json({ ok: true, op: 'pituitary_adenoma', result: r }); }));
router.post('/adrenal_insufficiency', asyncH((req, res) => { const r = f.adrenal_insufficiency(req.body || {}); res.json({ ok: true, op: 'adrenal_insufficiency', result: r }); }));
module.exports = router;
