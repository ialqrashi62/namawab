const express = require('express');
const router = express.Router();
const { funcs } = require('./tier114_trauma_603_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ptsd', asyncH((req, res) => { const r = f.ptsd(req.body || {}); res.json({ ok: true, op: 'ptsd', result: r }); }));
router.post('/acute_stress', asyncH((req, res) => { const r = f.acute_stress(req.body || {}); res.json({ ok: true, op: 'acute_stress', result: r }); }));
router.post('/adjustment', asyncH((req, res) => { const r = f.adjustment(req.body || {}); res.json({ ok: true, op: 'adjustment', result: r }); }));
router.post('/complex_trauma', asyncH((req, res) => { const r = f.complex_trauma(req.body || {}); res.json({ ok: true, op: 'complex_trauma', result: r }); }));
router.post('/bereavement_reaction', asyncH((req, res) => { const r = f.bereavement_reaction(req.body || {}); res.json({ ok: true, op: 'bereavement_reaction', result: r }); }));
module.exports = router;
