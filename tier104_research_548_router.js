const express = require('express');
const router = express.Router();
const { funcs } = require('./tier104_research_548_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/research_protocol', asyncH((req, res) => { const r = f.research_protocol(req.body || {}); res.json({ ok: true, op: 'research_protocol', result: r }); }));
router.post('/clinical_trial_enrollment', asyncH((req, res) => { const r = f.clinical_trial_enrollment(req.body || {}); res.json({ ok: true, op: 'clinical_trial_enrollment', result: r }); }));
router.post('/data_collection', asyncH((req, res) => { const r = f.data_collection(req.body || {}); res.json({ ok: true, op: 'data_collection', result: r }); }));
router.post('/manuscript_prep', asyncH((req, res) => { const r = f.manuscript_prep(req.body || {}); res.json({ ok: true, op: 'manuscript_prep', result: r }); }));
router.post('/irb_submission', asyncH((req, res) => { const r = f.irb_submission(req.body || {}); res.json({ ok: true, op: 'irb_submission', result: r }); }));
module.exports = router;
