const express = require("express");
const router = express.Router();
const { funcs } = require("./tier128_womens_660_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/prenatal_visit", asyncH((req, res) => { const r = f.prenatal_visit(req.body || {}); res.json({ ok: true, op: "prenatal_visit", result: r }); }));
router.post("/postpartum", asyncH((req, res) => { const r = f.postpartum(req.body || {}); res.json({ ok: true, op: "postpartum", result: r }); }));
router.post("/contraception", asyncH((req, res) => { const r = f.contraception(req.body || {}); res.json({ ok: true, op: "contraception", result: r }); }));
router.post("/menopause", asyncH((req, res) => { const r = f.menopause(req.body || {}); res.json({ ok: true, op: "menopause", result: r }); }));
router.post("/infertility", asyncH((req, res) => { const r = f.infertility(req.body || {}); res.json({ ok: true, op: "infertility", result: r }); }));
module.exports = router;
