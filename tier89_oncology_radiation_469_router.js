const express = require('express');
const router = express.Router();
const { funcs } = require('./tier89_oncology_radiation_469_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/radiation_planning', asyncH((req, res) => { const r = f.radiation_planning(req.body || {}); res.json({ ok: true, op: 'radiation_planning', result: r }); }));
router.post('/dose_tracking', asyncH((req, res) => { const r = f.dose_tracking(req.body || {}); res.json({ ok: true, op: 'dose_tracking', result: r }); }));
router.post('/site_specific', asyncH((req, res) => { const r = f.site_specific(req.body || {}); res.json({ ok: true, op: 'site_specific', result: r }); }));
router.post('/radiation_toxicity', asyncH((req, res) => { const r = f.radiation_toxicity(req.body || {}); res.json({ ok: true, op: 'radiation_toxicity', result: r }); }));
router.post('/brachytherapy', asyncH((req, res) => { const r = f.brachytherapy(req.body || {}); res.json({ ok: true, op: 'brachytherapy', result: r }); }));
module.exports = router;
