const express = require('express');
const router = express.Router();
const { funcs } = require('./tier96_bone_metabolic_507_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/osteoporosis_screening', asyncH((req, res) => { const r = f.osteoporosis_screening(req.body || {}); res.json({ ok: true, op: 'osteoporosis_screening', result: r }); }));
router.post('/osteoporosis_treatment', asyncH((req, res) => { const r = f.osteoporosis_treatment(req.body || {}); res.json({ ok: true, op: 'osteoporosis_treatment', result: r }); }));
router.post('/hyperparathyroidism', asyncH((req, res) => { const r = f.hyperparathyroidism(req.body || {}); res.json({ ok: true, op: 'hyperparathyroidism', result: r }); }));
router.post('/pagets', asyncH((req, res) => { const r = f.pagets(req.body || {}); res.json({ ok: true, op: 'pagets', result: r }); }));
router.post('/vitamin_d', asyncH((req, res) => { const r = f.vitamin_d(req.body || {}); res.json({ ok: true, op: 'vitamin_d', result: r }); }));
module.exports = router;
