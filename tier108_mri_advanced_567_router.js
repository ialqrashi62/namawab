const express = require('express');
const router = express.Router();
const { funcs } = require('./tier108_mri_advanced_567_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/mri_brain', asyncH((req, res) => { const r = f.mri_brain(req.body || {}); res.json({ ok: true, op: 'mri_brain', result: r }); }));
router.post('/mri_spine', asyncH((req, res) => { const r = f.mri_spine(req.body || {}); res.json({ ok: true, op: 'mri_spine', result: r }); }));
router.post('/functional_mri', asyncH((req, res) => { const r = f.functional_mri(req.body || {}); res.json({ ok: true, op: 'functional_mri', result: r }); }));
router.post('/mr_angiography', asyncH((req, res) => { const r = f.mr_angiography(req.body || {}); res.json({ ok: true, op: 'mr_angiography', result: r }); }));
router.post('/mr_spectroscopy', asyncH((req, res) => { const r = f.mr_spectroscopy(req.body || {}); res.json({ ok: true, op: 'mr_spectroscopy', result: r }); }));
module.exports = router;
