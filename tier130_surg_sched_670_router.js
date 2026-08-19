const express = require("express");
const router = express.Router();
const { funcs } = require("./tier130_surg_sched_670_engine");
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post("/block_time", asyncH((req, res) => { const r = f.block_time(req.body || {}); res.json({ ok: true, op: "block_time", result: r }); }));
router.post("/pre_admission", asyncH((req, res) => { const r = f.pre_admission(req.body || {}); res.json({ ok: true, op: "pre_admission", result: r }); }));
router.post("/booking", asyncH((req, res) => { const r = f.booking(req.body || {}); res.json({ ok: true, op: "booking", result: r }); }));
router.post("/booking_cancel", asyncH((req, res) => { const r = f.booking_cancel(req.body || {}); res.json({ ok: true, op: "booking_cancel", result: r }); }));
router.post("/or_utilization", asyncH((req, res) => { const r = f.or_utilization(req.body || {}); res.json({ ok: true, op: "or_utilization", result: r }); }));
module.exports = router;
