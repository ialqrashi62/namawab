const express = require('express');
const router = express.Router();
const { funcs } = require('./tier137_nlp_668_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ner_extract', asyncH((req, res) => { const r = f.ner_extract(req.body || {}); res.json({ ok: true, op: 'ner_extract', result: r }); }));
router.post('/sentiment', asyncH((req, res) => { const r = f.sentiment(req.body || {}); res.json({ ok: true, op: 'sentiment', result: r }); }));
router.post('/summarization', asyncH((req, res) => { const r = f.summarization(req.body || {}); res.json({ ok: true, op: 'summarization', result: r }); }));
router.post('/icd_coding', asyncH((req, res) => { const r = f.icd_coding(req.body || {}); res.json({ ok: true, op: 'icd_coding', result: r }); }));
router.post('/transcription', asyncH((req, res) => { const r = f.transcription(req.body || {}); res.json({ ok: true, op: 'transcription', result: r }); }));
module.exports = router;