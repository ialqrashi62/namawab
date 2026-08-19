const express = require('express');
const router = express.Router();
const { funcs } = require('./tier96_diabetes_t1dm_503_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/t1dm_management', asyncH((req, res) => { const r = f.t1dm_management(req.body || {}); res.json({ ok: true, op: 't1dm_management', result: r }); }));
router.post('/insulin_pump', asyncH((req, res) => { const r = f.insulin_pump(req.body || {}); res.json({ ok: true, op: 'insulin_pump', result: r }); }));
router.post('/cgm_review', asyncH((req, res) => { const r = f.cgm_review(req.body || {}); res.json({ ok: true, op: 'cgm_review', result: r }); }));
router.post('/dka_management', asyncH((req, res) => { const r = f.dka_management(req.body || {}); res.json({ ok: true, op: 'dka_management', result: r }); }));
router.post('/hypoglycemia', asyncH((req, res) => { const r = f.hypoglycemia(req.body || {}); res.json({ ok: true, op: 'hypoglycemia', result: r }); }));
module.exports = router;
