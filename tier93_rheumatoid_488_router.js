const express = require('express');
const router = express.Router();
const { funcs } = require('./tier93_rheumatoid_488_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ra_assessment', asyncH((req, res) => { const r = f.ra_assessment(req.body || {}); res.json({ ok: true, op: 'ra_assessment', result: r }); }));
router.post('/ra_treatment', asyncH((req, res) => { const r = f.ra_treatment(req.body || {}); res.json({ ok: true, op: 'ra_treatment', result: r }); }));
router.post('/ra_monitoring', asyncH((req, res) => { const r = f.ra_monitoring(req.body || {}); res.json({ ok: true, op: 'ra_monitoring', result: r }); }));
router.post('/ra_imaging', asyncH((req, res) => { const r = f.ra_imaging(req.body || {}); res.json({ ok: true, op: 'ra_imaging', result: r }); }));
router.post('/ra_surgery', asyncH((req, res) => { const r = f.ra_surgery(req.body || {}); res.json({ ok: true, op: 'ra_surgery', result: r }); }));
module.exports = router;
