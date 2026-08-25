const express = require('express');
const router = express.Router();
const { funcs } = require('./tier111_dialysis_588_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/hd_session', asyncH((req, res) => { const r = f.hd_session(req.body || {}); res.json({ ok: true, op: 'hd_session', result: r }); }));
router.post('/peritoneal_dialysis', asyncH((req, res) => { const r = f.peritoneal_dialysis(req.body || {}); res.json({ ok: true, op: 'peritoneal_dialysis', result: r }); }));
router.post('/dialysis_access', asyncH((req, res) => { const r = f.dialysis_access(req.body || {}); res.json({ ok: true, op: 'dialysis_access', result: r }); }));
router.post('/anemia_management', asyncH((req, res) => { const r = f.anemia_management(req.body || {}); res.json({ ok: true, op: 'anemia_management', result: r }); }));
router.post('/bone_mineral', asyncH((req, res) => { const r = f.bone_mineral(req.body || {}); res.json({ ok: true, op: 'bone_mineral', result: r }); }));
module.exports = router;
