const express = require('express');
const router = express.Router();
const { funcs } = require('./tier102_surg_trauma_536_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/trauma_assessment', asyncH((req, res) => { const r = f.trauma_assessment(req.body || {}); res.json({ ok: true, op: 'trauma_assessment', result: r }); }));
router.post('/damage_control', asyncH((req, res) => { const r = f.damage_control(req.body || {}); res.json({ ok: true, op: 'damage_control', result: r }); }));
router.post('/resuscitation', asyncH((req, res) => { const r = f.resuscitation(req.body || {}); res.json({ ok: true, op: 'resuscitation', result: r }); }));
router.post('/penetrating_trauma', asyncH((req, res) => { const r = f.penetrating_trauma(req.body || {}); res.json({ ok: true, op: 'penetrating_trauma', result: r }); }));
router.post('/blunt_trauma', asyncH((req, res) => { const r = f.blunt_trauma(req.body || {}); res.json({ ok: true, op: 'blunt_trauma', result: r }); }));
module.exports = router;
