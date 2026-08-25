const express = require('express');
const router = express.Router();
const { funcs } = require('./tier134_beh_685_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/screening', asyncH((req, res) => { const r = f.screening(req.body || {}); res.json({ ok: true, op: 'screening', result: r }); }));
router.post('/counseling', asyncH((req, res) => { const r = f.counseling(req.body || {}); res.json({ ok: true, op: 'counseling', result: r }); }));
router.post('/crisis', asyncH((req, res) => { const r = f.crisis(req.body || {}); res.json({ ok: true, op: 'crisis', result: r }); }));
router.post('/substance', asyncH((req, res) => { const r = f.substance(req.body || {}); res.json({ ok: true, op: 'substance', result: r }); }));
router.post('/therapy', asyncH((req, res) => { const r = f.therapy(req.body || {}); res.json({ ok: true, op: 'therapy', result: r }); }));
module.exports = router;