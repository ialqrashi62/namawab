const express = require('express');
const router = express.Router();
const { funcs } = require('./tier121_pharm_advanced_632_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/controlled_substance', asyncH((req, res) => { const r = f.controlled_substance(req.body || {}); res.json({ ok: true, op: 'controlled_substance', result: r }); }));
router.post('/compounded_sterile', asyncH((req, res) => { const r = f.compounded_sterile(req.body || {}); res.json({ ok: true, op: 'compounded_sterile', result: r }); }));
router.post('/radiopharmaceutical', asyncH((req, res) => { const r = f.radiopharmaceutical(req.body || {}); res.json({ ok: true, op: 'radiopharmaceutical', result: r }); }));
router.post('/biologic_therapy', asyncH((req, res) => { const r = f.biologic_therapy(req.body || {}); res.json({ ok: true, op: 'biologic_therapy', result: r }); }));
router.post('/specialty_med', asyncH((req, res) => { const r = f.specialty_med(req.body || {}); res.json({ ok: true, op: 'specialty_med', result: r }); }));
module.exports = router;
