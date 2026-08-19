const express = require('express');
const router = express.Router();
const { funcs } = require('./tier141_vox_676_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/voice_command', asyncH((req, res) => { const r = f.voice_command(req.body || {}); res.json({ ok: true, op: 'voice_command', result: r }); }));
router.post('/wake_word', asyncH((req, res) => { const r = f.wake_word(req.body || {}); res.json({ ok: true, op: 'wake_word', result: r }); }));
router.post('/dictation', asyncH((req, res) => { const r = f.dictation(req.body || {}); res.json({ ok: true, op: 'dictation', result: r }); }));
router.post('/biometric_voice', asyncH((req, res) => { const r = f.biometric_voice(req.body || {}); res.json({ ok: true, op: 'biometric_voice', result: r }); }));
router.post('/ambient_listen', asyncH((req, res) => { const r = f.ambient_listen(req.body || {}); res.json({ ok: true, op: 'ambient_listen', result: r }); }));
module.exports = router;