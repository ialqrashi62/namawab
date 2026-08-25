const express = require('express');
const router = express.Router();
const { funcs } = require('./tier95_hepatology_pediatric_501_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/neonatal_hepatitis', asyncH((req, res) => { const r = f.neonatal_hepatitis(req.body || {}); res.json({ ok: true, op: 'neonatal_hepatitis', result: r }); }));
router.post('/biliary_atresia', asyncH((req, res) => { const r = f.biliary_atresia(req.body || {}); res.json({ ok: true, op: 'biliary_atresia', result: r }); }));
router.post('/pediatric_liver_transplant', asyncH((req, res) => { const r = f.pediatric_liver_transplant(req.body || {}); res.json({ ok: true, op: 'pediatric_liver_transplant', result: r }); }));
router.post('/pediatric_pf_icp', asyncH((req, res) => { const r = f.pediatric_pf_icp(req.body || {}); res.json({ ok: true, op: 'pediatric_pf_icp', result: r }); }));
router.post('/alpha_1_antitrypsin', asyncH((req, res) => { const r = f.alpha_1_antitrypsin(req.body || {}); res.json({ ok: true, op: 'alpha_1_antitrypsin', result: r }); }));
module.exports = router;
