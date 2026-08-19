const express = require('express');
const router = express.Router();
const { funcs } = require('./tier93_vasculitis_492_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/gca', asyncH((req, res) => { const r = f.gca(req.body || {}); res.json({ ok: true, op: 'gca', result: r }); }));
router.post('/takayasu', asyncH((req, res) => { const r = f.takayasu(req.body || {}); res.json({ ok: true, op: 'takayasu', result: r }); }));
router.post('/anca_vasculitis', asyncH((req, res) => { const r = f.anca_vasculitis(req.body || {}); res.json({ ok: true, op: 'anca_vasculitis', result: r }); }));
router.post('/polyarteritis', asyncH((req, res) => { const r = f.polyarteritis(req.body || {}); res.json({ ok: true, op: 'polyarteritis', result: r }); }));
router.post('/secondary_vasculitis', asyncH((req, res) => { const r = f.secondary_vasculitis(req.body || {}); res.json({ ok: true, op: 'secondary_vasculitis', result: r }); }));
module.exports = router;
