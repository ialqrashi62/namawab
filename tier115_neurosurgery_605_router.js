const express = require('express');
const router = express.Router();
const { funcs } = require('./tier115_neurosurgery_605_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/craniotomy', asyncH((req, res) => { const r = f.craniotomy(req.body || {}); res.json({ ok: true, op: 'craniotomy', result: r }); }));
router.post('/spine_fusion', asyncH((req, res) => { const r = f.spine_fusion(req.body || {}); res.json({ ok: true, op: 'spine_fusion', result: r }); }));
router.post('/tumor_resection', asyncH((req, res) => { const r = f.tumor_resection(req.body || {}); res.json({ ok: true, op: 'tumor_resection', result: r }); }));
router.post('/vp_shunt', asyncH((req, res) => { const r = f.vp_shunt(req.body || {}); res.json({ ok: true, op: 'vp_shunt', result: r }); }));
router.post('/cervical_decompression', asyncH((req, res) => { const r = f.cervical_decompression(req.body || {}); res.json({ ok: true, op: 'cervical_decompression', result: r }); }));
module.exports = router;
