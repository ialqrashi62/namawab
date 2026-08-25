const express = require('express');
const router = express.Router();
const { funcs } = require('./tier108_ct_advanced_566_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ct_cardiac', asyncH((req, res) => { const r = f.ct_cardiac(req.body || {}); res.json({ ok: true, op: 'ct_cardiac', result: r }); }));
router.post('/ct_pulmonary_angiogram', asyncH((req, res) => { const r = f.ct_pulmonary_angiogram(req.body || {}); res.json({ ok: true, op: 'ct_pulmonary_angiogram', result: r }); }));
router.post('/ct_perfusion', asyncH((req, res) => { const r = f.ct_perfusion(req.body || {}); res.json({ ok: true, op: 'ct_perfusion', result: r }); }));
router.post('/ct_enterography', asyncH((req, res) => { const r = f.ct_enterography(req.body || {}); res.json({ ok: true, op: 'ct_enterography', result: r }); }));
router.post('/ct_virtual_colonoscopy', asyncH((req, res) => { const r = f.ct_virtual_colonoscopy(req.body || {}); res.json({ ok: true, op: 'ct_virtual_colonoscopy', result: r }); }));
module.exports = router;
