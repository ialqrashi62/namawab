const express = require("express");
const router = express.Router();
const { funcs } = require("./tier130_pharm_admin_668_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/order_entry", asyncH((req, res) => { const r = f.order_entry(req.body || {}); res.json({ ok: true, op: "order_entry", result: r }); }));
router.post("/iv_admixture", asyncH((req, res) => { const r = f.iv_admixture(req.body || {}); res.json({ ok: true, op: "iv_admixture", result: r }); }));
router.post("/patient_education_rx", asyncH((req, res) => { const r = f.patient_education_rx(req.body || {}); res.json({ ok: true, op: "patient_education_rx", result: r }); }));
router.post("/med_reconciliation", asyncH((req, res) => { const r = f.med_reconciliation(req.body || {}); res.json({ ok: true, op: "med_reconciliation", result: r }); }));
router.post("/inventory_check", asyncH((req, res) => { const r = f.inventory_check(req.body || {}); res.json({ ok: true, op: "inventory_check", result: r }); }));
module.exports = router;
