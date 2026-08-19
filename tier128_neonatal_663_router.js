const express = require("express");
const router = express.Router();
const { funcs } = require("./tier128_neonatal_663_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/nicu_admission", asyncH((req, res) => { const r = f.nicu_admission(req.body || {}); res.json({ ok: true, op: "nicu_admission", result: r }); }));
router.post("/apgar", asyncH((req, res) => { const r = f.apgar(req.body || {}); res.json({ ok: true, op: "apgar", result: r }); }));
router.post("/phototherapy", asyncH((req, res) => { const r = f.phototherapy(req.body || {}); res.json({ ok: true, op: "phototherapy", result: r }); }));
router.post("/kangaroo_care", asyncH((req, res) => { const r = f.kangaroo_care(req.body || {}); res.json({ ok: true, op: "kangaroo_care", result: r }); }));
router.post("/nicu_discharge", asyncH((req, res) => { const r = f.nicu_discharge(req.body || {}); res.json({ ok: true, op: "nicu_discharge", result: r }); }));
module.exports = router;
