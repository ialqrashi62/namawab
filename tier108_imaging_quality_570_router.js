const express = require('express');
const router = express.Router();
const { funcs } = require('./tier108_imaging_quality_570_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/accreditation', asyncH((req, res) => { const r = f.accreditation(req.body || {}); res.json({ ok: true, op: 'accreditation', result: r }); }));
router.post('/dose_monitoring', asyncH((req, res) => { const r = f.dose_monitoring(req.body || {}); res.json({ ok: true, op: 'dose_monitoring', result: r }); }));
router.post('/image_quality', asyncH((req, res) => { const r = f.image_quality(req.body || {}); res.json({ ok: true, op: 'image_quality', result: r }); }));
router.post('/report_turnaround', asyncH((req, res) => { const r = f.report_turnaround(req.body || {}); res.json({ ok: true, op: 'report_turnaround', result: r }); }));
router.post('/peer_review', asyncH((req, res) => { const r = f.peer_review(req.body || {}); res.json({ ok: true, op: 'peer_review', result: r }); }));
module.exports = router;
