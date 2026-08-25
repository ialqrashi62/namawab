const express = require('express');
const router = express.Router();
const { funcs } = require('./tier102_surg_vascular_535_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/aaa_repair', asyncH((req, res) => { const r = f.aaa_repair(req.body || {}); res.json({ ok: true, op: 'aaa_repair', result: r }); }));
router.post('/carotid_endarterectomy', asyncH((req, res) => { const r = f.carotid_endarterectomy(req.body || {}); res.json({ ok: true, op: 'carotid_endarterectomy', result: r }); }));
router.post('/bypass_graft', asyncH((req, res) => { const r = f.bypass_graft(req.body || {}); res.json({ ok: true, op: 'bypass_graft', result: r }); }));
router.post('/varicose_veins', asyncH((req, res) => { const r = f.varicose_veins(req.body || {}); res.json({ ok: true, op: 'varicose_veins', result: r }); }));
router.post('/dvt_treatment', asyncH((req, res) => { const r = f.dvt_treatment(req.body || {}); res.json({ ok: true, op: 'dvt_treatment', result: r }); }));
module.exports = router;
