const express = require('express');
const router = express.Router();
const { funcs } = require('./tier107_iv_therapy_564_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/iv_insertion', asyncH((req, res) => { const r = f.iv_insertion(req.body || {}); res.json({ ok: true, op: 'iv_insertion', result: r }); }));
router.post('/iv_maintenance', asyncH((req, res) => { const r = f.iv_maintenance(req.body || {}); res.json({ ok: true, op: 'iv_maintenance', result: r }); }));
router.post('/central_line', asyncH((req, res) => { const r = f.central_line(req.body || {}); res.json({ ok: true, op: 'central_line', result: r }); }));
router.post('/phlebotomy', asyncH((req, res) => { const r = f.phlebotomy(req.body || {}); res.json({ ok: true, op: 'phlebotomy', result: r }); }));
router.post('/infusion_reaction', asyncH((req, res) => { const r = f.infusion_reaction(req.body || {}); res.json({ ok: true, op: 'infusion_reaction', result: r }); }));
module.exports = router;
