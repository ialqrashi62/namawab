const express = require('express');
const router = express.Router();
const { funcs } = require('./tier94_pulm_function_493_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/spirometry', asyncH((req, res) => { const r = f.spirometry(req.body || {}); res.json({ ok: true, op: 'spirometry', result: r }); }));
router.post('/lung_volumes', asyncH((req, res) => { const r = f.lung_volumes(req.body || {}); res.json({ ok: true, op: 'lung_volumes', result: r }); }));
router.post('/dlco', asyncH((req, res) => { const r = f.dlco(req.body || {}); res.json({ ok: true, op: 'dlco', result: r }); }));
router.post('/six_min_walk', asyncH((req, res) => { const r = f.six_min_walk(req.body || {}); res.json({ ok: true, op: 'six_min_walk', result: r }); }));
router.post('/mip_mep', asyncH((req, res) => { const r = f.mip_mep(req.body || {}); res.json({ ok: true, op: 'mip_mep', result: r }); }));
module.exports = router;
