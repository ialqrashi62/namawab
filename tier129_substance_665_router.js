const express = require("express");
const router = express.Router();
const { funcs } = require("./tier129_substance_665_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/audit_c", asyncH((req, res) => { const r = f.audit_c(req.body || {}); res.json({ ok: true, op: "audit_c", result: r }); }));
router.post("/dast", asyncH((req, res) => { const r = f.dast(req.body || {}); res.json({ ok: true, op: "dast", result: r }); }));
router.post("/detox", asyncH((req, res) => { const r = f.detox(req.body || {}); res.json({ ok: true, op: "detox", result: r }); }));
router.post("/naloxone", asyncH((req, res) => { const r = f.naloxone(req.body || {}); res.json({ ok: true, op: "naloxone", result: r }); }));
router.post("/rehab_enroll", asyncH((req, res) => { const r = f.rehab_enroll(req.body || {}); res.json({ ok: true, op: "rehab_enroll", result: r }); }));
module.exports = router;
