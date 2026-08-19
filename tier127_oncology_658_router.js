const express = require("express");
const router = express.Router();
const { funcs } = require("./tier127_oncology_658_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/chemo_cycle", asyncH((req, res) => { const r = f.chemo_cycle(req.body || {}); res.json({ ok: true, op: "chemo_cycle", result: r }); }));
router.post("/tumor_response", asyncH((req, res) => { const r = f.tumor_response(req.body || {}); res.json({ ok: true, op: "tumor_response", result: r }); }));
router.post("/survivorship", asyncH((req, res) => { const r = f.survivorship(req.body || {}); res.json({ ok: true, op: "survivorship", result: r }); }));
router.post("/palliative_care", asyncH((req, res) => { const r = f.palliative_care(req.body || {}); res.json({ ok: true, op: "palliative_care", result: r }); }));
router.post("/hospice_eval", asyncH((req, res) => { const r = f.hospice_eval(req.body || {}); res.json({ ok: true, op: "hospice_eval", result: r }); }));
module.exports = router;
