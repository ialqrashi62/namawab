const express = require("express");
const router = express.Router();
const { funcs } = require("./tier126_orthotics_655_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/splint", asyncH((req, res) => { const r = f.splint(req.body || {}); res.json({ ok: true, op: "splint", result: r }); }));
router.post("/cast", asyncH((req, res) => { const r = f.cast(req.body || {}); res.json({ ok: true, op: "cast", result: r }); }));
router.post("/bracing", asyncH((req, res) => { const r = f.bracing(req.body || {}); res.json({ ok: true, op: "bracing", result: r }); }));
router.post("/prosthetic", asyncH((req, res) => { const r = f.prosthetic(req.body || {}); res.json({ ok: true, op: "prosthetic", result: r }); }));
router.post("/orthotic", asyncH((req, res) => { const r = f.orthotic(req.body || {}); res.json({ ok: true, op: "orthotic", result: r }); }));
module.exports = router;
