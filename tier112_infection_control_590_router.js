const express = require('express');
const router = express.Router();
const { funcs } = require('./tier112_infection_control_590_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/hai_surveillance', asyncH((req, res) => { const r = f.hai_surveillance(req.body || {}); res.json({ ok: true, op: 'hai_surveillance', result: r }); }));
router.post('/isolation_precautions', asyncH((req, res) => { const r = f.isolation_precautions(req.body || {}); res.json({ ok: true, op: 'isolation_precautions', result: r }); }));
router.post('/catheter_bundle', asyncH((req, res) => { const r = f.catheter_bundle(req.body || {}); res.json({ ok: true, op: 'catheter_bundle', result: r }); }));
router.post('/ssi_prevention', asyncH((req, res) => { const r = f.ssi_prevention(req.body || {}); res.json({ ok: true, op: 'ssi_prevention', result: r }); }));
router.post('/hand_hygiene_compliance', asyncH((req, res) => { const r = f.hand_hygiene_compliance(req.body || {}); res.json({ ok: true, op: 'hand_hygiene_compliance', result: r }); }));
module.exports = router;
