const express = require("express");
const router = express.Router();
const { funcs } = require("./tier129_ed_extended_667_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/triage", asyncH((req, res) => { const r = f.triage(req.body || {}); res.json({ ok: true, op: "triage", result: r }); }));
router.post("/trauma_assess", asyncH((req, res) => { const r = f.trauma_assess(req.body || {}); res.json({ ok: true, op: "trauma_assess", result: r }); }));
router.post("/sepsis_bundle", asyncH((req, res) => { const r = f.sepsis_bundle(req.body || {}); res.json({ ok: true, op: "sepsis_bundle", result: r }); }));
router.post("/stroke_protocol", asyncH((req, res) => { const r = f.stroke_protocol(req.body || {}); res.json({ ok: true, op: "stroke_protocol", result: r }); }));
router.post("/ami_protocol", asyncH((req, res) => { const r = f.ami_protocol(req.body || {}); res.json({ ok: true, op: "ami_protocol", result: r }); }));
module.exports = router;
