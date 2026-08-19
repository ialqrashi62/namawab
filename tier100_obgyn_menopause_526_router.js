const express = require('express');
const router = express.Router();
const { funcs } = require('./tier100_obgyn_menopause_526_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/menopause_assessment', asyncH((req, res) => { const r = f.menopause_assessment(req.body || {}); res.json({ ok: true, op: 'menopause_assessment', result: r }); }));
router.post('/hrt_therapy', asyncH((req, res) => { const r = f.hrt_therapy(req.body || {}); res.json({ ok: true, op: 'hrt_therapy', result: r }); }));
router.post('/urogynecology', asyncH((req, res) => { const r = f.urogynecology(req.body || {}); res.json({ ok: true, op: 'urogynecology', result: r }); }));
router.post('/abnormal_uterine_bleeding', asyncH((req, res) => { const r = f.abnormal_uterine_bleeding(req.body || {}); res.json({ ok: true, op: 'abnormal_uterine_bleeding', result: r }); }));
router.post('/endometriosis', asyncH((req, res) => { const r = f.endometriosis(req.body || {}); res.json({ ok: true, op: 'endometriosis', result: r }); }));
module.exports = router;
