const express = require('express');
const router = express.Router();
const { funcs } = require('./tier106_trauma_center_556_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/trauma_team_activation', asyncH((req, res) => { const r = f.trauma_team_activation(req.body || {}); res.json({ ok: true, op: 'trauma_team_activation', result: r }); }));
router.post('/massive_transfusion', asyncH((req, res) => { const r = f.massive_transfusion(req.body || {}); res.json({ ok: true, op: 'massive_transfusion', result: r }); }));
router.post('/damage_control_surgery', asyncH((req, res) => { const r = f.damage_control_surgery(req.body || {}); res.json({ ok: true, op: 'damage_control_surgery', result: r }); }));
router.post('/icu_admission', asyncH((req, res) => { const r = f.icu_admission(req.body || {}); res.json({ ok: true, op: 'icu_admission', result: r }); }));
router.post('/rehab_referral', asyncH((req, res) => { const r = f.rehab_referral(req.body || {}); res.json({ ok: true, op: 'rehab_referral', result: r }); }));
module.exports = router;
