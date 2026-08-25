const express = require('express');
const router = express.Router();
const { funcs } = require('./tier137_pred_670_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/readmission', asyncH((req, res) => { const r = f.readmission(req.body || {}); res.json({ ok: true, op: 'readmission', result: r }); }));
router.post('/mortality', asyncH((req, res) => { const r = f.mortality(req.body || {}); res.json({ ok: true, op: 'mortality', result: r }); }));
router.post('/los_predict', asyncH((req, res) => { const r = f.los_predict(req.body || {}); res.json({ ok: true, op: 'los_predict', result: r }); }));
router.post('/fall_risk', asyncH((req, res) => { const r = f.fall_risk(req.body || {}); res.json({ ok: true, op: 'fall_risk', result: r }); }));
router.post('/deterioration', asyncH((req, res) => { const r = f.deterioration(req.body || {}); res.json({ ok: true, op: 'deterioration', result: r }); }));
module.exports = router;