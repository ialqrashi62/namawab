const express = require('express');
const router = express.Router();
const { funcs } = require('./tier100_obgyn_reproductive_527_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/contraception_counseling', asyncH((req, res) => { const r = f.contraception_counseling(req.body || {}); res.json({ ok: true, op: 'contraception_counseling', result: r }); }));
router.post('/iud_insertion', asyncH((req, res) => { const r = f.iud_insertion(req.body || {}); res.json({ ok: true, op: 'iud_insertion', result: r }); }));
router.post('/sti_screening', asyncH((req, res) => { const r = f.sti_screening(req.body || {}); res.json({ ok: true, op: 'sti_screening', result: r }); }));
router.post('/pelvic_pain', asyncH((req, res) => { const r = f.pelvic_pain(req.body || {}); res.json({ ok: true, op: 'pelvic_pain', result: r }); }));
router.post('/gyne_surgery', asyncH((req, res) => { const r = f.gyne_surgery(req.body || {}); res.json({ ok: true, op: 'gyne_surgery', result: r }); }));
module.exports = router;
