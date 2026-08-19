const express = require('express');
const router = express.Router();
const { funcs } = require('./tier95_hepatology_viral_498_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/hcv_assessment', asyncH((req, res) => { const r = f.hcv_assessment(req.body || {}); res.json({ ok: true, op: 'hcv_assessment', result: r }); }));
router.post('/hcv_treatment', asyncH((req, res) => { const r = f.hcv_treatment(req.body || {}); res.json({ ok: true, op: 'hcv_treatment', result: r }); }));
router.post('/hbv_assessment', asyncH((req, res) => { const r = f.hbv_assessment(req.body || {}); res.json({ ok: true, op: 'hbv_assessment', result: r }); }));
router.post('/hbv_treatment', asyncH((req, res) => { const r = f.hbv_treatment(req.body || {}); res.json({ ok: true, op: 'hbv_treatment', result: r }); }));
router.post('/hepatitis_vaccination', asyncH((req, res) => { const r = f.hepatitis_vaccination(req.body || {}); res.json({ ok: true, op: 'hepatitis_vaccination', result: r }); }));
module.exports = router;
