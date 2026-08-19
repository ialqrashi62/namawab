const express = require("express");
const router = express.Router();
const { funcs } = require("./tier129_icu_666_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/vent_settings", asyncH((req, res) => { const r = f.vent_settings(req.body || {}); res.json({ ok: true, op: "vent_settings", result: r }); }));
router.post("/sedation", asyncH((req, res) => { const r = f.sedation(req.body || {}); res.json({ ok: true, op: "sedation", result: r }); }));
router.post("/vasopressor", asyncH((req, res) => { const r = f.vasopressor(req.body || {}); res.json({ ok: true, op: "vasopressor", result: r }); }));
router.post("/fluid_balance", asyncH((req, res) => { const r = f.fluid_balance(req.body || {}); res.json({ ok: true, op: "fluid_balance", result: r }); }));
router.post("/icu_consult", asyncH((req, res) => { const r = f.icu_consult(req.body || {}); res.json({ ok: true, op: "icu_consult", result: r }); }));
module.exports = router;
