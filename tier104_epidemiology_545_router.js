const express = require('express');
const router = express.Router();
const { funcs } = require('./tier104_epidemiology_545_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/disease_surveillance', asyncH((req, res) => { const r = f.disease_surveillance(req.body || {}); res.json({ ok: true, op: 'disease_surveillance', result: r }); }));
router.post('/outbreak_investigation', asyncH((req, res) => { const r = f.outbreak_investigation(req.body || {}); res.json({ ok: true, op: 'outbreak_investigation', result: r }); }));
router.post('/vaccine_tracking', asyncH((req, res) => { const r = f.vaccine_tracking(req.body || {}); res.json({ ok: true, op: 'vaccine_tracking', result: r }); }));
router.post('/screening_program', asyncH((req, res) => { const r = f.screening_program(req.body || {}); res.json({ ok: true, op: 'screening_program', result: r }); }));
router.post('/registry_data', asyncH((req, res) => { const r = f.registry_data(req.body || {}); res.json({ ok: true, op: 'registry_data', result: r }); }));
module.exports = router;
