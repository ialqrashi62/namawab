const express = require('express');
const router = express.Router();
const { funcs } = require('./tier120_coding_629_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/icd10_coding', asyncH((req, res) => { const r = f.icd10_coding(req.body || {}); res.json({ ok: true, op: 'icd10_coding', result: r }); }));
router.post('/cpt_coding', asyncH((req, res) => { const r = f.cpt_coding(req.body || {}); res.json({ ok: true, op: 'cpt_coding', result: r }); }));
router.post('/hcpcs_coding', asyncH((req, res) => { const r = f.hcpcs_coding(req.body || {}); res.json({ ok: true, op: 'hcpcs_coding', result: r }); }));
router.post('/drg_assignment', asyncH((req, res) => { const r = f.drg_assignment(req.body || {}); res.json({ ok: true, op: 'drg_assignment', result: r }); }));
router.post('/coding_audit', asyncH((req, res) => { const r = f.coding_audit(req.body || {}); res.json({ ok: true, op: 'coding_audit', result: r }); }));
module.exports = router;
