const express = require('express');
const router = express.Router();
const { funcs } = require('./tier112_sterilization_593_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/sterilization_validation', asyncH((req, res) => { const r = f.sterilization_validation(req.body || {}); res.json({ ok: true, op: 'sterilization_validation', result: r }); }));
router.post('/biological_indicator', asyncH((req, res) => { const r = f.biological_indicator(req.body || {}); res.json({ ok: true, op: 'biological_indicator', result: r }); }));
router.post('/chemical_indicator', asyncH((req, res) => { const r = f.chemical_indicator(req.body || {}); res.json({ ok: true, op: 'chemical_indicator', result: r }); }));
router.post('/sterilization_failure', asyncH((req, res) => { const r = f.sterilization_failure(req.body || {}); res.json({ ok: true, op: 'sterilization_failure', result: r }); }));
router.post('/scope_reprocessing', asyncH((req, res) => { const r = f.scope_reprocessing(req.body || {}); res.json({ ok: true, op: 'scope_reprocessing', result: r }); }));
module.exports = router;
