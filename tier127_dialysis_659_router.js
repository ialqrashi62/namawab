const express = require("express");
const router = express.Router();
const { funcs } = require("./tier127_dialysis_659_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/hemodialysis", asyncH((req, res) => { const r = f.hemodialysis(req.body || {}); res.json({ ok: true, op: "hemodialysis", result: r }); }));
router.post("/peritoneal", asyncH((req, res) => { const r = f.peritoneal(req.body || {}); res.json({ ok: true, op: "peritoneal", result: r }); }));
router.post("/access_monitoring", asyncH((req, res) => { const r = f.access_monitoring(req.body || {}); res.json({ ok: true, op: "access_monitoring", result: r }); }));
router.post("/transplant_workup", asyncH((req, res) => { const r = f.transplant_workup(req.body || {}); res.json({ ok: true, op: "transplant_workup", result: r }); }));
router.post("/ckd_followup", asyncH((req, res) => { const r = f.ckd_followup(req.body || {}); res.json({ ok: true, op: "ckd_followup", result: r }); }));
module.exports = router;
