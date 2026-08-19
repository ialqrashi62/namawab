const express = require('express');
const router = express.Router();
const { funcs } = require('./tier142_pa_679_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pain_assess', asyncH((req, res) => { const r = f.pain_assess(req.body || {}); res.json({ ok: true, op: 'pain_assess', result: r }); }));
router.post('/nerve_block', asyncH((req, res) => { const r = f.nerve_block(req.body || {}); res.json({ ok: true, op: 'nerve_block', result: r }); }));
router.post('/pump', asyncH((req, res) => { const r = f.pump(req.body || {}); res.json({ ok: true, op: 'pump', result: r }); }));
router.post('/spinal_cord_stim', asyncH((req, res) => { const r = f.spinal_cord_stim(req.body || {}); res.json({ ok: true, op: 'spinal_cord_stim', result: r }); }));
router.post('/intrathecal', asyncH((req, res) => { const r = f.intrathecal(req.body || {}); res.json({ ok: true, op: 'intrathecal', result: r }); }));
module.exports = router;
