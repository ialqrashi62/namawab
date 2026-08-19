const express = require("express");
const router = express.Router();
const { funcs } = require("./tier128_pediatric_662_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/well_child", asyncH((req, res) => { const r = f.well_child(req.body || {}); res.json({ ok: true, op: "well_child", result: r }); }));
router.post("/immunization", asyncH((req, res) => { const r = f.immunization(req.body || {}); res.json({ ok: true, op: "immunization", result: r }); }));
router.post("/newborn_screen", asyncH((req, res) => { const r = f.newborn_screen(req.body || {}); res.json({ ok: true, op: "newborn_screen", result: r }); }));
router.post("/feeding", asyncH((req, res) => { const r = f.feeding(req.body || {}); res.json({ ok: true, op: "feeding", result: r }); }));
router.post("/growth_chart", asyncH((req, res) => { const r = f.growth_chart(req.body || {}); res.json({ ok: true, op: "growth_chart", result: r }); }));
module.exports = router;
