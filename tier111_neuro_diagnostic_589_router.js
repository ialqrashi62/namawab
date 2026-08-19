const express = require('express');
const router = express.Router();
const { funcs } = require('./tier111_neuro_diagnostic_589_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/eeg', asyncH((req, res) => { const r = f.eeg(req.body || {}); res.json({ ok: true, op: 'eeg', result: r }); }));
router.post('/eeg_monitoring', asyncH((req, res) => { const r = f.eeg_monitoring(req.body || {}); res.json({ ok: true, op: 'eeg_monitoring', result: r }); }));
router.post('/emg_ncs', asyncH((req, res) => { const r = f.emg_ncs(req.body || {}); res.json({ ok: true, op: 'emg_ncs', result: r }); }));
router.post('/evoked_potentials', asyncH((req, res) => { const r = f.evoked_potentials(req.body || {}); res.json({ ok: true, op: 'evoked_potentials', result: r }); }));
router.post('/lumbar_puncture', asyncH((req, res) => { const r = f.lumbar_puncture(req.body || {}); res.json({ ok: true, op: 'lumbar_puncture', result: r }); }));
module.exports = router;
