const express = require("express");
const router = express.Router();
const { funcs } = require("./tier123_dental_640_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/dental_exam", asyncH((req, res) => { const r = f.dental_exam(req.body || {}); res.json({ ok: true, op: "dental_exam", result: r }); }));
router.post("/restorative", asyncH((req, res) => { const r = f.restorative(req.body || {}); res.json({ ok: true, op: "restorative", result: r }); }));
router.post("/endodontic", asyncH((req, res) => { const r = f.endodontic(req.body || {}); res.json({ ok: true, op: "endodontic", result: r }); }));
router.post("/periodontal", asyncH((req, res) => { const r = f.periodontal(req.body || {}); res.json({ ok: true, op: "periodontal", result: r }); }));
router.post("/orthodontic", asyncH((req, res) => { const r = f.orthodontic(req.body || {}); res.json({ ok: true, op: "orthodontic", result: r }); }));
module.exports = router;
