const express = require('express');
const router = express.Router();
const { funcs } = require('./tier115_otolaryngology_607_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/sinus_surgery', asyncH((req, res) => { const r = f.sinus_surgery(req.body || {}); res.json({ ok: true, op: 'sinus_surgery', result: r }); }));
router.post('/hearing_aid', asyncH((req, res) => { const r = f.hearing_aid(req.body || {}); res.json({ ok: true, op: 'hearing_aid', result: r }); }));
router.post('/cochlear_implant', asyncH((req, res) => { const r = f.cochlear_implant(req.body || {}); res.json({ ok: true, op: 'cochlear_implant', result: r }); }));
router.post('/tonsillectomy', asyncH((req, res) => { const r = f.tonsillectomy(req.body || {}); res.json({ ok: true, op: 'tonsillectomy', result: r }); }));
router.post('/thyroidectomy', asyncH((req, res) => { const r = f.thyroidectomy(req.body || {}); res.json({ ok: true, op: 'thyroidectomy', result: r }); }));
module.exports = router;
