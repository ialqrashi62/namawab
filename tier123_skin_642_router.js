const express = require("express");
const router = express.Router();
const { funcs } = require("./tier123_skin_642_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/skin_biopsy", asyncH((req, res) => { const r = f.skin_biopsy(req.body || {}); res.json({ ok: true, op: "skin_biopsy", result: r }); }));
router.post("/dermoscopy", asyncH((req, res) => { const r = f.dermoscopy(req.body || {}); res.json({ ok: true, op: "dermoscopy", result: r }); }));
router.post("/lesion_excision", asyncH((req, res) => { const r = f.lesion_excision(req.body || {}); res.json({ ok: true, op: "lesion_excision", result: r }); }));
router.post("/patch_test", asyncH((req, res) => { const r = f.patch_test(req.body || {}); res.json({ ok: true, op: "patch_test", result: r }); }));
router.post("/cryotherapy", asyncH((req, res) => { const r = f.cryotherapy(req.body || {}); res.json({ ok: true, op: "cryotherapy", result: r }); }));
module.exports = router;
