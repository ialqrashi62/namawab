const express = require('express');
const router = express.Router();
const { funcs } = require('./tier102_surg_general_533_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/hernia_repair', asyncH((req, res) => { const r = f.hernia_repair(req.body || {}); res.json({ ok: true, op: 'hernia_repair', result: r }); }));
router.post('/cholecystectomy', asyncH((req, res) => { const r = f.cholecystectomy(req.body || {}); res.json({ ok: true, op: 'cholecystectomy', result: r }); }));
router.post('/appendectomy', asyncH((req, res) => { const r = f.appendectomy(req.body || {}); res.json({ ok: true, op: 'appendectomy', result: r }); }));
router.post('/bowel_resection', asyncH((req, res) => { const r = f.bowel_resection(req.body || {}); res.json({ ok: true, op: 'bowel_resection', result: r }); }));
router.post('/soft_tissue', asyncH((req, res) => { const r = f.soft_tissue(req.body || {}); res.json({ ok: true, op: 'soft_tissue', result: r }); }));
module.exports = router;
