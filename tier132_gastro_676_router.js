const express = require('express');
const router = express.Router();
const { funcs } = require('./tier132_gastro_676_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ercp', asyncH((req, res) => { const r = f.ercp(req.body || {}); res.json({ ok: true, op: 'ercp', result: r }); }));
router.post('/liver_biopsy', asyncH((req, res) => { const r = f.liver_biopsy(req.body || {}); res.json({ ok: true, op: 'liver_biopsy', result: r }); }));
router.post('/us_elastography', asyncH((req, res) => { const r = f.us_elastography(req.body || {}); res.json({ ok: true, op: 'us_elastography', result: r }); }));
router.post('/manometry', asyncH((req, res) => { const r = f.manometry(req.body || {}); res.json({ ok: true, op: 'manometry', result: r }); }));
router.post('/ct_enterography', asyncH((req, res) => { const r = f.ct_enterography(req.body || {}); res.json({ ok: true, op: 'ct_enterography', result: r }); }));
module.exports = router;
