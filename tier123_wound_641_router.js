const express = require("express");
const router = express.Router();
const { funcs } = require("./tier123_wound_641_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/wound_assessment", asyncH((req, res) => { const r = f.wound_assessment(req.body || {}); res.json({ ok: true, op: "wound_assessment", result: r }); }));
router.post("/wound_dressing", asyncH((req, res) => { const r = f.wound_dressing(req.body || {}); res.json({ ok: true, op: "wound_dressing", result: r }); }));
router.post("/wound_culture", asyncH((req, res) => { const r = f.wound_culture(req.body || {}); res.json({ ok: true, op: "wound_culture", result: r }); }));
router.post("/debridement", asyncH((req, res) => { const r = f.debridement(req.body || {}); res.json({ ok: true, op: "debridement", result: r }); }));
router.post("/wound_closure", asyncH((req, res) => { const r = f.wound_closure(req.body || {}); res.json({ ok: true, op: "wound_closure", result: r }); }));
module.exports = router;
