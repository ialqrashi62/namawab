const express = require("express");
const router = express.Router();
const { funcs } = require("./tier126_pain_654_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/pain_assessment", asyncH((req, res) => { const r = f.pain_assessment(req.body || {}); res.json({ ok: true, op: "pain_assessment", result: r }); }));
router.post("/analgesic_admin", asyncH((req, res) => { const r = f.analgesic_admin(req.body || {}); res.json({ ok: true, op: "analgesic_admin", result: r }); }));
router.post("/nerve_block", asyncH((req, res) => { const r = f.nerve_block(req.body || {}); res.json({ ok: true, op: "nerve_block", result: r }); }));
router.post("/pca_pump", asyncH((req, res) => { const r = f.pca_pump(req.body || {}); res.json({ ok: true, op: "pca_pump", result: r }); }));
router.post("/intrathecal", asyncH((req, res) => { const r = f.intrathecal(req.body || {}); res.json({ ok: true, op: "intrathecal", result: r }); }));
module.exports = router;
