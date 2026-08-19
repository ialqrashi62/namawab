const express = require('express');
const router = express.Router();
const { funcs } = require('./tier135_pcu_690_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/picu_admission', asyncH((req, res) => { const r = f.picu_admission(req.body || {}); res.json({ ok: true, op: 'picu_admission', result: r }); }));
router.post('/vent_mgmt', asyncH((req, res) => { const r = f.vent_mgmt(req.body || {}); res.json({ ok: true, op: 'vent_mgmt', result: r }); }));
router.post('/sedation', asyncH((req, res) => { const r = f.sedation(req.body || {}); res.json({ ok: true, op: 'sedation', result: r }); }));
router.post('/ecmo', asyncH((req, res) => { const r = f.ecmo(req.body || {}); res.json({ ok: true, op: 'ecmo', result: r }); }));
router.post('/code_event', asyncH((req, res) => { const r = f.code_event(req.body || {}); res.json({ ok: true, op: 'code_event', result: r }); }));
module.exports = router;