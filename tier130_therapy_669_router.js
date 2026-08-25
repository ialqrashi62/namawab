const express = require("express");
const router = express.Router();
const { funcs } = require("./tier130_therapy_669_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/pt_session", asyncH((req, res) => { const r = f.pt_session(req.body || {}); res.json({ ok: true, op: "pt_session", result: r }); }));
router.post("/ot_session", asyncH((req, res) => { const r = f.ot_session(req.body || {}); res.json({ ok: true, op: "ot_session", result: r }); }));
router.post("/st_session", asyncH((req, res) => { const r = f.st_session(req.body || {}); res.json({ ok: true, op: "st_session", result: r }); }));
router.post("/rt_session", asyncH((req, res) => { const r = f.rt_session(req.body || {}); res.json({ ok: true, op: "rt_session", result: r }); }));
router.post("/dialysis_session", asyncH((req, res) => { const r = f.dialysis_session(req.body || {}); res.json({ ok: true, op: "dialysis_session", result: r }); }));
module.exports = router;
