const express = require("express");
const router = express.Router();
const { funcs } = require("./tier125_microbiology_650_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/culture_growth", asyncH((req, res) => { const r = f.culture_growth(req.body || {}); res.json({ ok: true, op: "culture_growth", result: r }); }));
router.post("/gram_stain", asyncH((req, res) => { const r = f.gram_stain(req.body || {}); res.json({ ok: true, op: "gram_stain", result: r }); }));
router.post("/sensitivity", asyncH((req, res) => { const r = f.sensitivity(req.body || {}); res.json({ ok: true, op: "sensitivity", result: r }); }));
router.post("/parasitology", asyncH((req, res) => { const r = f.parasitology(req.body || {}); res.json({ ok: true, op: "parasitology", result: r }); }));
router.post("/mycology", asyncH((req, res) => { const r = f.mycology(req.body || {}); res.json({ ok: true, op: "mycology", result: r }); }));
module.exports = router;
