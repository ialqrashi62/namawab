const express = require('express');
const router = express.Router();
const { funcs } = require('./tier97_neph_dialysis_511_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/hemodialysis', asyncH((req, res) => { const r = f.hemodialysis(req.body || {}); res.json({ ok: true, op: 'hemodialysis', result: r }); }));
router.post('/peritoneal_dialysis', asyncH((req, res) => { const r = f.peritoneal_dialysis(req.body || {}); res.json({ ok: true, op: 'peritoneal_dialysis', result: r }); }));
router.post('/vascular_access', asyncH((req, res) => { const r = f.vascular_access(req.body || {}); res.json({ ok: true, op: 'vascular_access', result: r }); }));
router.post('/anemia_ckd', asyncH((req, res) => { const r = f.anemia_ckd(req.body || {}); res.json({ ok: true, op: 'anemia_ckd', result: r }); }));
router.post('/mineral_bone_ckd', asyncH((req, res) => { const r = f.mineral_bone_ckd(req.body || {}); res.json({ ok: true, op: 'mineral_bone_ckd', result: r }); }));
module.exports = router;
