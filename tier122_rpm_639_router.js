const express = require('express');
const router = express.Router();
const { funcs } = require('./tier122_rpm_639_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/rpm_enrollment', asyncH((req, res) => { const r = f.rpm_enrollment(req.body || {}); res.json({ ok: true, op: 'rpm_enrollment', result: r }); }));
router.post('/reading_outlier', asyncH((req, res) => { const r = f.reading_outlier(req.body || {}); res.json({ ok: true, op: 'reading_outlier', result: r }); }));
router.post('/med_adherence', asyncH((req, res) => { const r = f.med_adherence(req.body || {}); res.json({ ok: true, op: 'med_adherence', result: r }); }));
router.post('/care_pathway', asyncH((req, res) => { const r = f.care_pathway(req.body || {}); res.json({ ok: true, op: 'care_pathway', result: r }); }));
router.post('/coaching', asyncH((req, res) => { const r = f.coaching(req.body || {}); res.json({ ok: true, op: 'coaching', result: r }); }));
module.exports = router;
