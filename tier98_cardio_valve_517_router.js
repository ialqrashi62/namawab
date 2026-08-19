const express = require('express');
const router = express.Router();
const { funcs } = require('./tier98_cardio_valve_517_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/aortic_stenosis', asyncH((req, res) => { const r = f.aortic_stenosis(req.body || {}); res.json({ ok: true, op: 'aortic_stenosis', result: r }); }));
router.post('/mitral_regurgitation', asyncH((req, res) => { const r = f.mitral_regurgitation(req.body || {}); res.json({ ok: true, op: 'mitral_regurgitation', result: r }); }));
router.post('/tricuspid_regurg', asyncH((req, res) => { const r = f.tricuspid_regurg(req.body || {}); res.json({ ok: true, op: 'tricuspid_regurg', result: r }); }));
router.post('/valve_surgery', asyncH((req, res) => { const r = f.valve_surgery(req.body || {}); res.json({ ok: true, op: 'valve_surgery', result: r }); }));
router.post('/endocarditis', asyncH((req, res) => { const r = f.endocarditis(req.body || {}); res.json({ ok: true, op: 'endocarditis', result: r }); }));
module.exports = router;
