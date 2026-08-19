const express = require("express");
const router = express.Router();
const { funcs } = require("./tier125_transfusion_651_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/type_screen", asyncH((req, res) => { const r = f.type_screen(req.body || {}); res.json({ ok: true, op: "type_screen", result: r }); }));
router.post("/crossmatch", asyncH((req, res) => { const r = f.crossmatch(req.body || {}); res.json({ ok: true, op: "crossmatch", result: r }); }));
router.post("/transfuse_unit", asyncH((req, res) => { const r = f.transfuse_unit(req.body || {}); res.json({ ok: true, op: "transfuse_unit", result: r }); }));
router.post("/reaction_investigation", asyncH((req, res) => { const r = f.reaction_investigation(req.body || {}); res.json({ ok: true, op: "reaction_investigation", result: r }); }));
router.post("/apheresis", asyncH((req, res) => { const r = f.apheresis(req.body || {}); res.json({ ok: true, op: "apheresis", result: r }); }));
module.exports = router;
