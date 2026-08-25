const express = require('express');
const router = express.Router();
const { funcs } = require('./tier100_obgyn_gyn_onc_524_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ovarian_cyst', asyncH((req, res) => { const r = f.ovarian_cyst(req.body || {}); res.json({ ok: true, op: 'ovarian_cyst', result: r }); }));
router.post('/cervical_cancer_screening', asyncH((req, res) => { const r = f.cervical_cancer_screening(req.body || {}); res.json({ ok: true, op: 'cervical_cancer_screening', result: r }); }));
router.post('/endometrial_cancer', asyncH((req, res) => { const r = f.endometrial_cancer(req.body || {}); res.json({ ok: true, op: 'endometrial_cancer', result: r }); }));
router.post('/ovarian_cancer_staging', asyncH((req, res) => { const r = f.ovarian_cancer_staging(req.body || {}); res.json({ ok: true, op: 'ovarian_cancer_staging', result: r }); }));
router.post('/gyn_chemotherapy', asyncH((req, res) => { const r = f.gyn_chemotherapy(req.body || {}); res.json({ ok: true, op: 'gyn_chemotherapy', result: r }); }));
module.exports = router;
