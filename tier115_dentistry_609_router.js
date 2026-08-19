const express = require('express');
const router = express.Router();
const { funcs } = require('./tier115_dentistry_609_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/extraction', asyncH((req, res) => { const r = f.extraction(req.body || {}); res.json({ ok: true, op: 'extraction', result: r }); }));
router.post('/root_canal', asyncH((req, res) => { const r = f.root_canal(req.body || {}); res.json({ ok: true, op: 'root_canal', result: r }); }));
router.post('/implant', asyncH((req, res) => { const r = f.implant(req.body || {}); res.json({ ok: true, op: 'implant', result: r }); }));
router.post('/orthodontic', asyncH((req, res) => { const r = f.orthodontic(req.body || {}); res.json({ ok: true, op: 'orthodontic', result: r }); }));
router.post('/periodontal', asyncH((req, res) => { const r = f.periodontal(req.body || {}); res.json({ ok: true, op: 'periodontal', result: r }); }));
module.exports = router;
