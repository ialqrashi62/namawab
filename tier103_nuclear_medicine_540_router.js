const express = require('express');
const router = express.Router();
const { funcs } = require('./tier103_nuclear_medicine_540_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pet_ct', asyncH((req, res) => { const r = f.pet_ct(req.body || {}); res.json({ ok: true, op: 'pet_ct', result: r }); }));
router.post('/bone_scan', asyncH((req, res) => { const r = f.bone_scan(req.body || {}); res.json({ ok: true, op: 'bone_scan', result: r }); }));
router.post('/thyroid_scan', asyncH((req, res) => { const r = f.thyroid_scan(req.body || {}); res.json({ ok: true, op: 'thyroid_scan', result: r }); }));
router.post('/myocardial_perfusion', asyncH((req, res) => { const r = f.myocardial_perfusion(req.body || {}); res.json({ ok: true, op: 'myocardial_perfusion', result: r }); }));
router.post('/therapy_radionuclide', asyncH((req, res) => { const r = f.therapy_radionuclide(req.body || {}); res.json({ ok: true, op: 'therapy_radionuclide', result: r }); }));
module.exports = router;
