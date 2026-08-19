const express = require("express");
const router = express.Router();
const { funcs } = require("./tier127_cardio_656_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/ecg_full", asyncH((req, res) => { const r = f.ecg_full(req.body || {}); res.json({ ok: true, op: "ecg_full", result: r }); }));
router.post("/pacemaker", asyncH((req, res) => { const r = f.pacemaker(req.body || {}); res.json({ ok: true, op: "pacemaker", result: r }); }));
router.post("/icd_check", asyncH((req, res) => { const r = f.icd_check(req.body || {}); res.json({ ok: true, op: "icd_check", result: r }); }));
router.post("/cardiac_rehab", asyncH((req, res) => { const r = f.cardiac_rehab(req.body || {}); res.json({ ok: true, op: "cardiac_rehab", result: r }); }));
router.post("/chf_followup", asyncH((req, res) => { const r = f.chf_followup(req.body || {}); res.json({ ok: true, op: "chf_followup", result: r }); }));
module.exports = router;
