const express = require('express');
const router = express.Router();
const { funcs } = require('./tier143_ob_681_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pregnancy_register', asyncH((req, res) => { const r = f.pregnancy_register(req.body || {}); res.json({ ok: true, op: 'pregnancy_register', result: r }); }));
router.post('/antenatal_visit', asyncH((req, res) => { const r = f.antenatal_visit(req.body || {}); res.json({ ok: true, op: 'antenatal_visit', result: r }); }));
router.post('/ultrasound', asyncH((req, res) => { const r = f.ultrasound(req.body || {}); res.json({ ok: true, op: 'ultrasound', result: r }); }));
router.post('/delivery', asyncH((req, res) => { const r = f.delivery(req.body || {}); res.json({ ok: true, op: 'delivery', result: r }); }));
router.post('/postpartum', asyncH((req, res) => { const r = f.postpartum(req.body || {}); res.json({ ok: true, op: 'postpartum', result: r }); }));
module.exports = router;