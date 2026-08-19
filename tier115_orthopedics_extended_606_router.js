const express = require('express');
const router = express.Router();
const { funcs } = require('./tier115_orthopedics_extended_606_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/joint_replacement', asyncH((req, res) => { const r = f.joint_replacement(req.body || {}); res.json({ ok: true, op: 'joint_replacement', result: r }); }));
router.post('/arthroscopy', asyncH((req, res) => { const r = f.arthroscopy(req.body || {}); res.json({ ok: true, op: 'arthroscopy', result: r }); }));
router.post('/fracture_fixation', asyncH((req, res) => { const r = f.fracture_fixation(req.body || {}); res.json({ ok: true, op: 'fracture_fixation', result: r }); }));
router.post('/spinal_decompression', asyncH((req, res) => { const r = f.spinal_decompression(req.body || {}); res.json({ ok: true, op: 'spinal_decompression', result: r }); }));
router.post('/ligament_repair', asyncH((req, res) => { const r = f.ligament_repair(req.body || {}); res.json({ ok: true, op: 'ligament_repair', result: r }); }));
module.exports = router;
