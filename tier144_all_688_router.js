const express = require('express');
const router = express.Router();
const { funcs } = require('./tier144_all_688_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/skin_test', asyncH((req, res) => { const r = f.skin_test(req.body || {}); res.json({ ok: true, op: 'skin_test', result: r }); }));
router.post('/ige', asyncH((req, res) => { const r = f.ige(req.body || {}); res.json({ ok: true, op: 'ige', result: r }); }));
router.post('/immunotherapy', asyncH((req, res) => { const r = f.immunotherapy(req.body || {}); res.json({ ok: true, op: 'immunotherapy', result: r }); }));
router.post('/anaphylaxis', asyncH((req, res) => { const r = f.anaphylaxis(req.body || {}); res.json({ ok: true, op: 'anaphylaxis', result: r }); }));
router.post('/biologic', asyncH((req, res) => { const r = f.biologic(req.body || {}); res.json({ ok: true, op: 'biologic', result: r }); }));
module.exports = router;