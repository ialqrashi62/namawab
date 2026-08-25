const express = require('express');
const router = express.Router();
const { funcs } = require('./tier144_neon_685_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/apgar', asyncH((req, res) => { const r = f.apgar(req.body || {}); res.json({ ok: true, op: 'apgar', result: r }); }));
router.post('/bilimeter', asyncH((req, res) => { const r = f.bilimeter(req.body || {}); res.json({ ok: true, op: 'bilimeter', result: r }); }));
router.post('/feeding', asyncH((req, res) => { const r = f.feeding(req.body || {}); res.json({ ok: true, op: 'feeding', result: r }); }));
router.post('/kangaroo', asyncH((req, res) => { const r = f.kangaroo(req.body || {}); res.json({ ok: true, op: 'kangaroo', result: r }); }));
router.post('/screening', asyncH((req, res) => { const r = f.screening(req.body || {}); res.json({ ok: true, op: 'screening', result: r }); }));
module.exports = router;