const express = require('express');
const router = express.Router();
const { funcs } = require('./tier110_pharmacy_clinical_580_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/order_review', asyncH((req, res) => { const r = f.order_review(req.body || {}); res.json({ ok: true, op: 'order_review', result: r }); }));
router.post('/renal_dosing', asyncH((req, res) => { const r = f.renal_dosing(req.body || {}); res.json({ ok: true, op: 'renal_dosing', result: r }); }));
router.post('/hepatic_dosing', asyncH((req, res) => { const r = f.hepatic_dosing(req.body || {}); res.json({ ok: true, op: 'hepatic_dosing', result: r }); }));
router.post('/therapeutic_drug_monitoring', asyncH((req, res) => { const r = f.therapeutic_drug_monitoring(req.body || {}); res.json({ ok: true, op: 'therapeutic_drug_monitoring', result: r }); }));
router.post('/iv_to_po_conversion', asyncH((req, res) => { const r = f.iv_to_po_conversion(req.body || {}); res.json({ ok: true, op: 'iv_to_po_conversion', result: r }); }));
module.exports = router;
