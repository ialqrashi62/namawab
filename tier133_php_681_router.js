const express = require('express');
const router = express.Router();
const { funcs } = require('./tier133_php_681_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/disease_surveillance', asyncH((req, res) => { const r = f.disease_surveillance(req.body || {}); res.json({ ok: true, op: 'disease_surveillance', result: r }); }));
router.post('/immunization_registry', asyncH((req, res) => { const r = f.immunization_registry(req.body || {}); res.json({ ok: true, op: 'immunization_registry', result: r }); }));
router.post('/outbreak_investigation', asyncH((req, res) => { const r = f.outbreak_investigation(req.body || {}); res.json({ ok: true, op: 'outbreak_investigation', result: r }); }));
router.post('/environmental_health', asyncH((req, res) => { const r = f.environmental_health(req.body || {}); res.json({ ok: true, op: 'environmental_health', result: r }); }));
router.post('/health_promotion', asyncH((req, res) => { const r = f.health_promotion(req.body || {}); res.json({ ok: true, op: 'health_promotion', result: r }); }));
module.exports = router;