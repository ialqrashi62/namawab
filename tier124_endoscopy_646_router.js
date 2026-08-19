const express = require('express');
const router = express.Router();
const { funcs } = require('./tier124_endoscopy_646_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/colonoscopy', asyncH((req, res) => { const r = f.colonoscopy(req.body || {}); res.json({ ok: true, op: 'colonoscopy', result: r }); }));
router.post('/egd', asyncH((req, res) => { const r = f.egd(req.body || {}); res.json({ ok: true, op: 'egd', result: r }); }));
router.post('/bronchoscopy', asyncH((req, res) => { const r = f.bronchoscopy(req.body || {}); res.json({ ok: true, op: 'bronchoscopy', result: r }); }));
router.post('/cystoscopy', asyncH((req, res) => { const r = f.cystoscopy(req.body || {}); res.json({ ok: true, op: 'cystoscopy', result: r }); }));
router.post('/laparoscopy', asyncH((req, res) => { const r = f.laparoscopy(req.body || {}); res.json({ ok: true, op: 'laparoscopy', result: r }); }));
module.exports = router;
