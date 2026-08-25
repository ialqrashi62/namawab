const express = require("express");
const router = express.Router();
const { funcs } = require("./tier128_maternal_661_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/high_risk_pregnancy", asyncH((req, res) => { const r = f.high_risk_pregnancy(req.body || {}); res.json({ ok: true, op: "high_risk_pregnancy", result: r }); }));
router.post("/gestational_diabetes", asyncH((req, res) => { const r = f.gestational_diabetes(req.body || {}); res.json({ ok: true, op: "gestational_diabetes", result: r }); }));
router.post("/preeclampsia", asyncH((req, res) => { const r = f.preeclampsia(req.body || {}); res.json({ ok: true, op: "preeclampsia", result: r }); }));
router.post("/nst", asyncH((req, res) => { const r = f.nst(req.body || {}); res.json({ ok: true, op: "nst", result: r }); }));
router.post("/biophysical_profile", asyncH((req, res) => { const r = f.biophysical_profile(req.body || {}); res.json({ ok: true, op: "biophysical_profile", result: r }); }));
module.exports = router;
