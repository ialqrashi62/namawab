const express = require('express');
const router = express.Router();
const { funcs } = require('./tier136_str_693_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/stroke_alert', asyncH((req, res) => { const r = f.stroke_alert(req.body || {}); res.json({ ok: true, op: 'stroke_alert', result: r }); }));
router.post('/tpa_admin', asyncH((req, res) => { const r = f.tpa_admin(req.body || {}); res.json({ ok: true, op: 'tpa_admin', result: r }); }));
router.post('/thrombectomy_proc', asyncH((req, res) => { const r = f.thrombectomy_proc(req.body || {}); res.json({ ok: true, op: 'thrombectomy_proc', result: r }); }));
router.post('/icp_monitor', asyncH((req, res) => { const r = f.icp_monitor(req.body || {}); res.json({ ok: true, op: 'icp_monitor', result: r }); }));
router.post('/recovery_milestone', asyncH((req, res) => { const r = f.recovery_milestone(req.body || {}); res.json({ ok: true, op: 'recovery_milestone', result: r }); }));
module.exports = router;