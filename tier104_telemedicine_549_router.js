const express = require('express');
const router = express.Router();
const { funcs } = require('./tier104_telemedicine_549_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/tele_consult', asyncH((req, res) => { const r = f.tele_consult(req.body || {}); res.json({ ok: true, op: 'tele_consult', result: r }); }));
router.post('/remote_monitoring', asyncH((req, res) => { const r = f.remote_monitoring(req.body || {}); res.json({ ok: true, op: 'remote_monitoring', result: r }); }));
router.post('/store_and_forward', asyncH((req, res) => { const r = f.store_and_forward(req.body || {}); res.json({ ok: true, op: 'store_and_forward', result: r }); }));
router.post('/virtual_triage', asyncH((req, res) => { const r = f.virtual_triage(req.body || {}); res.json({ ok: true, op: 'virtual_triage', result: r }); }));
router.post('/tele_icu', asyncH((req, res) => { const r = f.tele_icu(req.body || {}); res.json({ ok: true, op: 'tele_icu', result: r }); }));
module.exports = router;
