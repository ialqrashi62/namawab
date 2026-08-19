const express = require("express");
const router = express.Router();
const { funcs } = require("./tier130_education_671_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/chart_audit", asyncH((req, res) => { const r = f.chart_audit(req.body || {}); res.json({ ok: true, op: "chart_audit", result: r }); }));
router.post("/staff_education", asyncH((req, res) => { const r = f.staff_education(req.body || {}); res.json({ ok: true, op: "staff_education", result: r }); }));
router.post("/policy_review", asyncH((req, res) => { const r = f.policy_review(req.body || {}); res.json({ ok: true, op: "policy_review", result: r }); }));
router.post("/staff_training", asyncH((req, res) => { const r = f.staff_training(req.body || {}); res.json({ ok: true, op: "staff_training", result: r }); }));
router.post("/cme_credit", asyncH((req, res) => { const r = f.cme_credit(req.body || {}); res.json({ ok: true, op: "cme_credit", result: r }); }));
module.exports = router;
