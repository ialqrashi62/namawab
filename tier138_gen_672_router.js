const express = require('express');
const router = express.Router();
const { funcs } = require('./tier138_gen_672_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/fastq_qc', asyncH((req, res) => { const r = f.fastq_qc(req.body || {}); res.json({ ok: true, op: 'fastq_qc', result: r }); }));
router.post('/alignment', asyncH((req, res) => { const r = f.alignment(req.body || {}); res.json({ ok: true, op: 'alignment', result: r }); }));
router.post('/variant_call', asyncH((req, res) => { const r = f.variant_call(req.body || {}); res.json({ ok: true, op: 'variant_call', result: r }); }));
router.post('/annotation', asyncH((req, res) => { const r = f.annotation(req.body || {}); res.json({ ok: true, op: 'annotation', result: r }); }));
router.post('/report', asyncH((req, res) => { const r = f.report(req.body || {}); res.json({ ok: true, op: 'report', result: r }); }));
module.exports = router;