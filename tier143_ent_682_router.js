const express = require('express');
const router = express.Router();
const { funcs } = require('./tier143_ent_682_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/audiogram', asyncH((req, res) => { const r = f.audiogram(req.body || {}); res.json({ ok: true, op: 'audiogram', result: r }); }));
router.post('/endoscopy', asyncH((req, res) => { const r = f.endoscopy(req.body || {}); res.json({ ok: true, op: 'endoscopy', result: r }); }));
router.post('/tinnitus', asyncH((req, res) => { const r = f.tinnitus(req.body || {}); res.json({ ok: true, op: 'tinnitus', result: r }); }));
router.post('/sinus_ct', asyncH((req, res) => { const r = f.sinus_ct(req.body || {}); res.json({ ok: true, op: 'sinus_ct', result: r }); }));
router.post('/voice', asyncH((req, res) => { const r = f.voice(req.body || {}); res.json({ ok: true, op: 'voice', result: r }); }));
module.exports = router;