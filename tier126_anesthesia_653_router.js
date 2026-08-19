const express = require("express");
const router = express.Router();
const { funcs } = require("./tier126_anesthesia_653_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/preop_assessment", asyncH((req, res) => { const r = f.preop_assessment(req.body || {}); res.json({ ok: true, op: "preop_assessment", result: r }); }));
router.post("/anesthesia_induction", asyncH((req, res) => { const r = f.anesthesia_induction(req.body || {}); res.json({ ok: true, op: "anesthesia_induction", result: r }); }));
router.post("/intraop_monitoring", asyncH((req, res) => { const r = f.intraop_monitoring(req.body || {}); res.json({ ok: true, op: "intraop_monitoring", result: r }); }));
router.post("/emergence", asyncH((req, res) => { const r = f.emergence(req.body || {}); res.json({ ok: true, op: "emergence", result: r }); }));
router.post("/regional_block", asyncH((req, res) => { const r = f.regional_block(req.body || {}); res.json({ ok: true, op: "regional_block", result: r }); }));
module.exports = router;
