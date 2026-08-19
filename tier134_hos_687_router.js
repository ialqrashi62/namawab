const express = require('express');
const router = express.Router();
const { funcs } = require('./tier134_hos_687_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/admission', asyncH((req, res) => { const r = f.admission(req.body || {}); res.json({ ok: true, op: 'admission', result: r }); }));
router.post('/comfort_care', asyncH((req, res) => { const r = f.comfort_care(req.body || {}); res.json({ ok: true, op: 'comfort_care', result: r }); }));
router.post('/bereavement', asyncH((req, res) => { const r = f.bereavement(req.body || {}); res.json({ ok: true, op: 'bereavement', result: r }); }));
router.post('/respite', asyncH((req, res) => { const r = f.respite(req.body || {}); res.json({ ok: true, op: 'respite', result: r }); }));
router.post('/spiritual_care', asyncH((req, res) => { const r = f.spiritual_care(req.body || {}); res.json({ ok: true, op: 'spiritual_care', result: r }); }));
module.exports = router;