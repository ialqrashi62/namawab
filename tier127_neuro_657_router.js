const express = require("express");
const router = express.Router();
const { funcs } = require("./tier127_neuro_657_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/stroke_scale", asyncH((req, res) => { const r = f.stroke_scale(req.body || {}); res.json({ ok: true, op: "stroke_scale", result: r }); }));
router.post("/seizure", asyncH((req, res) => { const r = f.seizure(req.body || {}); res.json({ ok: true, op: "seizure", result: r }); }));
router.post("/neuro_exam", asyncH((req, res) => { const r = f.neuro_exam(req.body || {}); res.json({ ok: true, op: "neuro_exam", result: r }); }));
router.post("/eeg_report", asyncH((req, res) => { const r = f.eeg_report(req.body || {}); res.json({ ok: true, op: "eeg_report", result: r }); }));
router.post("/lumbar_puncture", asyncH((req, res) => { const r = f.lumbar_puncture(req.body || {}); res.json({ ok: true, op: "lumbar_puncture", result: r }); }));
module.exports = router;
