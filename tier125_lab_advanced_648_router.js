const express = require("express");
const router = express.Router();
const { funcs } = require("./tier125_lab_advanced_648_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/cbc_differential", asyncH((req, res) => { const r = f.cbc_differential(req.body || {}); res.json({ ok: true, op: "cbc_differential", result: r }); }));
router.post("/metabolic_panel", asyncH((req, res) => { const r = f.metabolic_panel(req.body || {}); res.json({ ok: true, op: "metabolic_panel", result: r }); }));
router.post("/coag_study", asyncH((req, res) => { const r = f.coag_study(req.body || {}); res.json({ ok: true, op: "coag_study", result: r }); }));
router.post("/urinalysis", asyncH((req, res) => { const r = f.urinalysis(req.body || {}); res.json({ ok: true, op: "urinalysis", result: r }); }));
router.post("/microalbumin", asyncH((req, res) => { const r = f.microalbumin(req.body || {}); res.json({ ok: true, op: "microalbumin", result: r }); }));
module.exports = router;
