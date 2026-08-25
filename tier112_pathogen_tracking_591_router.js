const express = require('express');
const router = express.Router();
const { funcs } = require('./tier112_pathogen_tracking_591_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/outbreak_detection', asyncH((req, res) => { const r = f.outbreak_detection(req.body || {}); res.json({ ok: true, op: 'outbreak_detection', result: r }); }));
router.post('/whole_genome_sequencing', asyncH((req, res) => { const r = f.whole_genome_sequencing(req.body || {}); res.json({ ok: true, op: 'whole_genome_sequencing', result: r }); }));
router.post('/contact_tracing', asyncH((req, res) => { const r = f.contact_tracing(req.body || {}); res.json({ ok: true, op: 'contact_tracing', result: r }); }));
router.post('/environmental_sampling', asyncH((req, res) => { const r = f.environmental_sampling(req.body || {}); res.json({ ok: true, op: 'environmental_sampling', result: r }); }));
router.post('/line_listing', asyncH((req, res) => { const r = f.line_listing(req.body || {}); res.json({ ok: true, op: 'line_listing', result: r }); }));
module.exports = router;
