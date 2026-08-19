const express = require('express');
const router = express.Router();
const { funcs } = require('./tier134_onc_684_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/chemo_order', asyncH((req, res) => { const r = f.chemo_order(req.body || {}); res.json({ ok: true, op: 'chemo_order', result: r }); }));
router.post('/radiation_session', asyncH((req, res) => { const r = f.radiation_session(req.body || {}); res.json({ ok: true, op: 'radiation_session', result: r }); }));
router.post('/tumor_board', asyncH((req, res) => { const r = f.tumor_board(req.body || {}); res.json({ ok: true, op: 'tumor_board', result: r }); }));
router.post('/survivorship', asyncH((req, res) => { const r = f.survivorship(req.body || {}); res.json({ ok: true, op: 'survivorship', result: r }); }));
router.post('/palliative_care', asyncH((req, res) => { const r = f.palliative_care(req.body || {}); res.json({ ok: true, op: 'palliative_care', result: r }); }));
module.exports = router;