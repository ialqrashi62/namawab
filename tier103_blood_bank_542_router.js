const express = require('express');
const router = express.Router();
const { funcs } = require('./tier103_blood_bank_542_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/type_and_cross', asyncH((req, res) => { const r = f.type_and_cross(req.body || {}); res.json({ ok: true, op: 'type_and_cross', result: r }); }));
router.post('/transfusion_reaction', asyncH((req, res) => { const r = f.transfusion_reaction(req.body || {}); res.json({ ok: true, op: 'transfusion_reaction', result: r }); }));
router.post('/plasma_exchange', asyncH((req, res) => { const r = f.plasma_exchange(req.body || {}); res.json({ ok: true, op: 'plasma_exchange', result: r }); }));
router.post('/platelet_transfusion', asyncH((req, res) => { const r = f.platelet_transfusion(req.body || {}); res.json({ ok: true, op: 'platelet_transfusion', result: r }); }));
router.post('/autologous_donation', asyncH((req, res) => { const r = f.autologous_donation(req.body || {}); res.json({ ok: true, op: 'autologous_donation', result: r }); }));
module.exports = router;
