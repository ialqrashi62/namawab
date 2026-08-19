const express = require("express");
const router = express.Router();
const { funcs } = require("./tier125_pathology_649_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/histology_report", asyncH((req, res) => { const r = f.histology_report(req.body || {}); res.json({ ok: true, op: "histology_report", result: r }); }));
router.post("/cytology", asyncH((req, res) => { const r = f.cytology(req.body || {}); res.json({ ok: true, op: "cytology", result: r }); }));
router.post("/frozen_section", asyncH((req, res) => { const r = f.frozen_section(req.body || {}); res.json({ ok: true, op: "frozen_section", result: r }); }));
router.post("/immuno_stain", asyncH((req, res) => { const r = f.immuno_stain(req.body || {}); res.json({ ok: true, op: "immuno_stain", result: r }); }));
router.post("/molecular_path", asyncH((req, res) => { const r = f.molecular_path(req.body || {}); res.json({ ok: true, op: "molecular_path", result: r }); }));
module.exports = router;
