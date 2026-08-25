const express = require('express');
const router = express.Router();
const { funcs } = require('./tier111_cardiac_cath_585_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/diagnostic_cath', asyncH((req, res) => { const r = f.diagnostic_cath(req.body || {}); res.json({ ok: true, op: 'diagnostic_cath', result: r }); }));
router.post('/intervention', asyncH((req, res) => { const r = f.intervention(req.body || {}); res.json({ ok: true, op: 'intervention', result: r }); }));
router.post('/pci', asyncH((req, res) => { const r = f.pci(req.body || {}); res.json({ ok: true, op: 'pci', result: r }); }));
router.post('/thrombectomy', asyncH((req, res) => { const r = f.thrombectomy(req.body || {}); res.json({ ok: true, op: 'thrombectomy', result: r }); }));
router.post('/structural', asyncH((req, res) => { const r = f.structural(req.body || {}); res.json({ ok: true, op: 'structural', result: r }); }));
module.exports = router;
