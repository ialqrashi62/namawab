const express = require('express');
const router = express.Router();
const { funcs } = require('./tier95_hepatology_cirrhosis_499_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cirrhosis_assessment', asyncH((req, res) => { const r = f.cirrhosis_assessment(req.body || {}); res.json({ ok: true, op: 'cirrhosis_assessment', result: r }); }));
router.post('/ascites_management', asyncH((req, res) => { const r = f.ascites_management(req.body || {}); res.json({ ok: true, op: 'ascites_management', result: r }); }));
router.post('/hepatic_encephalopathy', asyncH((req, res) => { const r = f.hepatic_encephalopathy(req.body || {}); res.json({ ok: true, op: 'hepatic_encephalopathy', result: r }); }));
router.post('/spontaneous_bacterial_peritonitis', asyncH((req, res) => { const r = f.spontaneous_bacterial_peritonitis(req.body || {}); res.json({ ok: true, op: 'spontaneous_bacterial_peritonitis', result: r }); }));
router.post('/variceal_bleeding', asyncH((req, res) => { const r = f.variceal_bleeding(req.body || {}); res.json({ ok: true, op: 'variceal_bleeding', result: r }); }));
module.exports = router;
