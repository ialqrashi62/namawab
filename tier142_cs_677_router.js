const express = require('express');
const router = express.Router();
const { funcs } = require('./tier142_cs_677_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cabg', asyncH((req, res) => { const r = f.cabg(req.body || {}); res.json({ ok: true, op: 'cabg', result: r }); }));
router.post('/valve', asyncH((req, res) => { const r = f.valve(req.body || {}); res.json({ ok: true, op: 'valve', result: r }); }));
router.post('/aortic', asyncH((req, res) => { const r = f.aortic(req.body || {}); res.json({ ok: true, op: 'aortic', result: r }); }));
router.post('/lung_resect', asyncH((req, res) => { const r = f.lung_resect(req.body || {}); res.json({ ok: true, op: 'lung_resect', result: r }); }));
router.post('/congenital', asyncH((req, res) => { const r = f.congenital(req.body || {}); res.json({ ok: true, op: 'congenital', result: r }); }));
module.exports = router;