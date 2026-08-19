const express = require('express');
const router = express.Router();
const { funcs } = require('./tier135_irc_688_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/angio', asyncH((req, res) => { const r = f.angio(req.body || {}); res.json({ ok: true, op: 'angio', result: r }); }));
router.post('/stenting', asyncH((req, res) => { const r = f.stenting(req.body || {}); res.json({ ok: true, op: 'stenting', result: r }); }));
router.post('/embolization', asyncH((req, res) => { const r = f.embolization(req.body || {}); res.json({ ok: true, op: 'embolization', result: r }); }));
router.post('/thrombectomy', asyncH((req, res) => { const r = f.thrombectomy(req.body || {}); res.json({ ok: true, op: 'thrombectomy', result: r }); }));
router.post('/ablation', asyncH((req, res) => { const r = f.ablation(req.body || {}); res.json({ ok: true, op: 'ablation', result: r }); }));
module.exports = router;