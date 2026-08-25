const express = require("express");
const router = express.Router();
const { funcs } = require("./tier123_eye_643_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/visual_acuity", asyncH((req, res) => { const r = f.visual_acuity(req.body || {}); res.json({ ok: true, op: "visual_acuity", result: r }); }));
router.post("/tonometry", asyncH((req, res) => { const r = f.tonometry(req.body || {}); res.json({ ok: true, op: "tonometry", result: r }); }));
router.post("/fundoscopy", asyncH((req, res) => { const r = f.fundoscopy(req.body || {}); res.json({ ok: true, op: "fundoscopy", result: r }); }));
router.post("/retinal_imaging", asyncH((req, res) => { const r = f.retinal_imaging(req.body || {}); res.json({ ok: true, op: "retinal_imaging", result: r }); }));
router.post("/oct_scan", asyncH((req, res) => { const r = f.oct_scan(req.body || {}); res.json({ ok: true, op: "oct_scan", result: r }); }));
module.exports = router;
