const express = require('express');
const router = express.Router();
const { funcs } = require('./tier122_telehealth_636_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/virtual_visit', asyncH((req, res) => { const r = f.virtual_visit(req.body || {}); res.json({ ok: true, op: 'virtual_visit', result: r }); }));
router.post('/remote_monitoring', asyncH((req, res) => { const r = f.remote_monitoring(req.body || {}); res.json({ ok: true, op: 'remote_monitoring', result: r }); }));
router.post('/tele_icu', asyncH((req, res) => { const r = f.tele_icu(req.body || {}); res.json({ ok: true, op: 'tele_icu', result: r }); }));
router.post('/tele_consult', asyncH((req, res) => { const r = f.tele_consult(req.body || {}); res.json({ ok: true, op: 'tele_consult', result: r }); }));
router.post('/digital_therapeutic', asyncH((req, res) => { const r = f.digital_therapeutic(req.body || {}); res.json({ ok: true, op: 'digital_therapeutic', result: r }); }));
module.exports = router;
