const express = require('express');
const router = express.Router();
const { funcs } = require('./tier112_immunization_592_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/vaccination_schedule', asyncH((req, res) => { const r = f.vaccination_schedule(req.body || {}); res.json({ ok: true, op: 'vaccination_schedule', result: r }); }));
router.post('/vaccine_administration', asyncH((req, res) => { const r = f.vaccine_administration(req.body || {}); res.json({ ok: true, op: 'vaccine_administration', result: r }); }));
router.post('/contraindication_screening', asyncH((req, res) => { const r = f.contraindication_screening(req.body || {}); res.json({ ok: true, op: 'contraindication_screening', result: r }); }));
router.post('/titer_checking', asyncH((req, res) => { const r = f.titer_checking(req.body || {}); res.json({ ok: true, op: 'titer_checking', result: r }); }));
router.post('/travel_vaccination', asyncH((req, res) => { const r = f.travel_vaccination(req.body || {}); res.json({ ok: true, op: 'travel_vaccination', result: r }); }));
module.exports = router;
