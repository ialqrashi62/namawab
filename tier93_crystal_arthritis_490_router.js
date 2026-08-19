const express = require('express');
const router = express.Router();
const { funcs } = require('./tier93_crystal_arthritis_490_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/gout_acute', asyncH((req, res) => { const r = f.gout_acute(req.body || {}); res.json({ ok: true, op: 'gout_acute', result: r }); }));
router.post('/gout_chronic', asyncH((req, res) => { const r = f.gout_chronic(req.body || {}); res.json({ ok: true, op: 'gout_chronic', result: r }); }));
router.post('/cppd', asyncH((req, res) => { const r = f.cppd(req.body || {}); res.json({ ok: true, op: 'cppd', result: r }); }));
router.post('/basic_calcium_phosphate', asyncH((req, res) => { const r = f.basic_calcium_phosphate(req.body || {}); res.json({ ok: true, op: 'basic_calcium_phosphate', result: r }); }));
router.post('/crystal_synovial', asyncH((req, res) => { const r = f.crystal_synovial(req.body || {}); res.json({ ok: true, op: 'crystal_synovial', result: r }); }));
module.exports = router;
