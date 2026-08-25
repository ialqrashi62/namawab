const express = require('express');
const router = express.Router();
const { funcs } = require('./tier93_spondyloarthropathy_489_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ankylosing_spondylitis', asyncH((req, res) => { const r = f.ankylosing_spondylitis(req.body || {}); res.json({ ok: true, op: 'ankylosing_spondylitis', result: r }); }));
router.post('/psoriatic_arthritis', asyncH((req, res) => { const r = f.psoriatic_arthritis(req.body || {}); res.json({ ok: true, op: 'psoriatic_arthritis', result: r }); }));
router.post('/ibd_arthritis', asyncH((req, res) => { const r = f.ibd_arthritis(req.body || {}); res.json({ ok: true, op: 'ibd_arthritis', result: r }); }));
router.post('/reactive_arthritis', asyncH((req, res) => { const r = f.reactive_arthritis(req.body || {}); res.json({ ok: true, op: 'reactive_arthritis', result: r }); }));
router.post('/enthesitis', asyncH((req, res) => { const r = f.enthesitis(req.body || {}); res.json({ ok: true, op: 'enthesitis', result: r }); }));
module.exports = router;
