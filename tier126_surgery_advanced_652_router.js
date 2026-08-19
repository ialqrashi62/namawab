const express = require("express");
const router = express.Router();
const { funcs } = require("./tier126_surgery_advanced_652_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/surgical_case", asyncH((req, res) => { const r = f.surgical_case(req.body || {}); res.json({ ok: true, op: "surgical_case", result: r }); }));
router.post("/trauma_surgery", asyncH((req, res) => { const r = f.trauma_surgery(req.body || {}); res.json({ ok: true, op: "trauma_surgery", result: r }); }));
router.post("/emergent_surgery", asyncH((req, res) => { const r = f.emergent_surgery(req.body || {}); res.json({ ok: true, op: "emergent_surgery", result: r }); }));
router.post("/complex_case", asyncH((req, res) => { const r = f.complex_case(req.body || {}); res.json({ ok: true, op: "complex_case", result: r }); }));
router.post("/fetal_surgery", asyncH((req, res) => { const r = f.fetal_surgery(req.body || {}); res.json({ ok: true, op: "fetal_surgery", result: r }); }));
module.exports = router;
