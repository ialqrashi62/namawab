const express = require('express');
const router = express.Router();
const { funcs } = require('./tier124_rad_advanced_644_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/mri_advanced', asyncH((req, res) => { const r = f.mri_advanced(req.body || {}); res.json({ ok: true, op: 'mri_advanced', result: r }); }));
router.post('/ct_advanced', asyncH((req, res) => { const r = f.ct_advanced(req.body || {}); res.json({ ok: true, op: 'ct_advanced', result: r }); }));
router.post('/pet_imaging', asyncH((req, res) => { const r = f.pet_imaging(req.body || {}); res.json({ ok: true, op: 'pet_imaging', result: r }); }));
router.post('/mammography', asyncH((req, res) => { const r = f.mammography(req.body || {}); res.json({ ok: true, op: 'mammography', result: r }); }));
router.post('/bone_density', asyncH((req, res) => { const r = f.bone_density(req.body || {}); res.json({ ok: true, op: 'bone_density', result: r }); }));
module.exports = router;
