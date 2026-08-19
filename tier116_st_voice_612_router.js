const express = require('express');
const router = express.Router();
const { funcs } = require('./tier116_st_voice_612_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/articulation', asyncH((req, res) => { const r = f.articulation(req.body || {}); res.json({ ok: true, op: 'articulation', result: r }); }));
router.post('/language_therapy', asyncH((req, res) => { const r = f.language_therapy(req.body || {}); res.json({ ok: true, op: 'language_therapy', result: r }); }));
router.post('/voice_therapy', asyncH((req, res) => { const r = f.voice_therapy(req.body || {}); res.json({ ok: true, op: 'voice_therapy', result: r }); }));
router.post('/cognitive_communication', asyncH((req, res) => { const r = f.cognitive_communication(req.body || {}); res.json({ ok: true, op: 'cognitive_communication', result: r }); }));
router.post('/dysphagia', asyncH((req, res) => { const r = f.dysphagia(req.body || {}); res.json({ ok: true, op: 'dysphagia', result: r }); }));
module.exports = router;
