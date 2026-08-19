const express = require('express');
const router = express.Router();
const { funcs } = require('./tier132_rheum_679_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/arthrocentesis', asyncH((req, res) => { const r = f.arthrocentesis(req.body || {}); res.json({ ok: true, op: 'arthrocentesis', result: r }); }));
router.post('/connective_tissue', asyncH((req, res) => { const r = f.connective_tissue(req.body || {}); res.json({ ok: true, op: 'connective_tissue', result: r }); }));
router.post('/dmards', asyncH((req, res) => { const r = f.dmards(req.body || {}); res.json({ ok: true, op: 'dmards', result: r }); }));
router.post('/rehab_assess', asyncH((req, res) => { const r = f.rehab_assess(req.body || {}); res.json({ ok: true, op: 'rehab_assess', result: r }); }));
router.post('/das28', asyncH((req, res) => { const r = f.das28(req.body || {}); res.json({ ok: true, op: 'das28', result: r }); }));
module.exports = router;
