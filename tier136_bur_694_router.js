const express = require('express');
const router = express.Router();
const { funcs } = require('./tier136_bur_694_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/burn_assess', asyncH((req, res) => { const r = f.burn_assess(req.body || {}); res.json({ ok: true, op: 'burn_assess', result: r }); }));
router.post('/fluid_resus', asyncH((req, res) => { const r = f.fluid_resus(req.body || {}); res.json({ ok: true, op: 'fluid_resus', result: r }); }));
router.post('/wound_care', asyncH((req, res) => { const r = f.wound_care(req.body || {}); res.json({ ok: true, op: 'wound_care', result: r }); }));
router.post('/inhalation', asyncH((req, res) => { const r = f.inhalation(req.body || {}); res.json({ ok: true, op: 'inhalation', result: r }); }));
router.post('/rehab', asyncH((req, res) => { const r = f.rehab(req.body || {}); res.json({ ok: true, op: 'rehab', result: r }); }));
module.exports = router;