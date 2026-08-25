const express = require('express');
const router = express.Router();
const { funcs } = require('./tier121_precision_med_635_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/molecular_tumor_board', asyncH((req, res) => { const r = f.molecular_tumor_board(req.body || {}); res.json({ ok: true, op: 'molecular_tumor_board', result: r }); }));
router.post('/targeted_therapy', asyncH((req, res) => { const r = f.targeted_therapy(req.body || {}); res.json({ ok: true, op: 'targeted_therapy', result: r }); }));
router.post('/companion_dx', asyncH((req, res) => { const r = f.companion_dx(req.body || {}); res.json({ ok: true, op: 'companion_dx', result: r }); }));
router.post('/liquid_biopsy', asyncH((req, res) => { const r = f.liquid_biopsy(req.body || {}); res.json({ ok: true, op: 'liquid_biopsy', result: r }); }));
router.post('/minimal_residual', asyncH((req, res) => { const r = f.minimal_residual(req.body || {}); res.json({ ok: true, op: 'minimal_residual', result: r }); }));
module.exports = router;
