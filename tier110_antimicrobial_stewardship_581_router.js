const express = require('express');
const router = express.Router();
const { funcs } = require('./tier110_antimicrobial_stewardship_581_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/culture_review', asyncH((req, res) => { const r = f.culture_review(req.body || {}); res.json({ ok: true, op: 'culture_review', result: r }); }));
router.post('/antibiotic_choice', asyncH((req, res) => { const r = f.antibiotic_choice(req.body || {}); res.json({ ok: true, op: 'antibiotic_choice', result: r }); }));
router.post('/duration_assessment', asyncH((req, res) => { const r = f.duration_assessment(req.body || {}); res.json({ ok: true, op: 'duration_assessment', result: r }); }));
router.post('/iv_to_po_switch', asyncH((req, res) => { const r = f.iv_to_po_switch(req.body || {}); res.json({ ok: true, op: 'iv_to_po_switch', result: r }); }));
router.post('/resistance_pattern', asyncH((req, res) => { const r = f.resistance_pattern(req.body || {}); res.json({ ok: true, op: 'resistance_pattern', result: r }); }));
module.exports = router;
