const express = require('express');
const router = express.Router();
const { funcs } = require('./tier94_pulm_interstitial_495_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ild_diagnosis', asyncH((req, res) => { const r = f.ild_diagnosis(req.body || {}); res.json({ ok: true, op: 'ild_diagnosis', result: r }); }));
router.post('/ipf_diagnosis', asyncH((req, res) => { const r = f.ipf_diagnosis(req.body || {}); res.json({ ok: true, op: 'ipf_diagnosis', result: r }); }));
router.post('/sarcoidosis', asyncH((req, res) => { const r = f.sarcoidosis(req.body || {}); res.json({ ok: true, op: 'sarcoidosis', result: r }); }));
router.post('/hypersensitivity_pneumonitis', asyncH((req, res) => { const r = f.hypersensitivity_pneumonitis(req.body || {}); res.json({ ok: true, op: 'hypersensitivity_pneumonitis', result: r }); }));
router.post('/connective_tissue_ild', asyncH((req, res) => { const r = f.connective_tissue_ild(req.body || {}); res.json({ ok: true, op: 'connective_tissue_ild', result: r }); }));
module.exports = router;
