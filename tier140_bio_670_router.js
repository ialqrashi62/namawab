const express = require('express');
const router = express.Router();
const { funcs } = require('./tier140_bio_670_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/syndromic_surveillance', asyncH((req, res) => { const r = f.syndromic_surveillance(req.body || {}); res.json({ ok: true, op: 'syndromic_surveillance', result: r }); }));
router.post('/lab_anomaly', asyncH((req, res) => { const r = f.lab_anomaly(req.body || {}); res.json({ ok: true, op: 'lab_anomaly', result: r }); }));
router.post('/travel_health', asyncH((req, res) => { const r = f.travel_health(req.body || {}); res.json({ ok: true, op: 'travel_health', result: r }); }));
router.post('/outbreak_trace', asyncH((req, res) => { const r = f.outbreak_trace(req.body || {}); res.json({ ok: true, op: 'outbreak_trace', result: r }); }));
router.post('/biorisk_score', asyncH((req, res) => { const r = f.biorisk_score(req.body || {}); res.json({ ok: true, op: 'biorisk_score', result: r }); }));
module.exports = router;