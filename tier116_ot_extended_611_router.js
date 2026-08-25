const express = require('express');
const router = express.Router();
const { funcs } = require('./tier116_ot_extended_611_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/adl_training', asyncH((req, res) => { const r = f.adl_training(req.body || {}); res.json({ ok: true, op: 'adl_training', result: r }); }));
router.post('/splinting', asyncH((req, res) => { const r = f.splinting(req.body || {}); res.json({ ok: true, op: 'splinting', result: r }); }));
router.post('/assistive_tech', asyncH((req, res) => { const r = f.assistive_tech(req.body || {}); res.json({ ok: true, op: 'assistive_tech', result: r }); }));
router.post('/cognitive_rehab', asyncH((req, res) => { const r = f.cognitive_rehab(req.body || {}); res.json({ ok: true, op: 'cognitive_rehab', result: r }); }));
router.post('/work_rehab', asyncH((req, res) => { const r = f.work_rehab(req.body || {}); res.json({ ok: true, op: 'work_rehab', result: r }); }));
module.exports = router;
