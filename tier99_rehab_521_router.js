const express = require('express');
const router = express.Router();
const { funcs } = require('./tier99_rehab_521_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/stroke_rehab', asyncH((req, res) => { const r = f.stroke_rehab(req.body || {}); res.json({ ok: true, op: 'stroke_rehab', result: r }); }));
router.post('/cardiac_rehab_phase2', asyncH((req, res) => { const r = f.cardiac_rehab_phase2(req.body || {}); res.json({ ok: true, op: 'cardiac_rehab_phase2', result: r }); }));
router.post('/pulmonary_rehab', asyncH((req, res) => { const r = f.pulmonary_rehab(req.body || {}); res.json({ ok: true, op: 'pulmonary_rehab', result: r }); }));
router.post('/joint_replacement', asyncH((req, res) => { const r = f.joint_replacement(req.body || {}); res.json({ ok: true, op: 'joint_replacement', result: r }); }));
router.post('/amputee_rehab', asyncH((req, res) => { const r = f.amputee_rehab(req.body || {}); res.json({ ok: true, op: 'amputee_rehab', result: r }); }));
module.exports = router;
