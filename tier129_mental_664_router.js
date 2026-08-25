const express = require("express");
const router = express.Router();
const { funcs } = require("./tier129_mental_664_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/phq9", asyncH((req, res) => { const r = f.phq9(req.body || {}); res.json({ ok: true, op: "phq9", result: r }); }));
router.post("/gad7", asyncH((req, res) => { const r = f.gad7(req.body || {}); res.json({ ok: true, op: "gad7", result: r }); }));
router.post("/pcl5", asyncH((req, res) => { const r = f.pcl5(req.body || {}); res.json({ ok: true, op: "pcl5", result: r }); }));
router.post("/crisis_eval", asyncH((req, res) => { const r = f.crisis_eval(req.body || {}); res.json({ ok: true, op: "crisis_eval", result: r }); }));
router.post("/psychotherapy", asyncH((req, res) => { const r = f.psychotherapy(req.body || {}); res.json({ ok: true, op: "psychotherapy", result: r }); }));
module.exports = router;
