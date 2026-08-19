const express = require('express');
const router = express.Router();
const { funcs } = require('./tier92_immunotherapy_486_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/allergen_immunotherapy', asyncH((req, res) => { const r = f.allergen_immunotherapy(req.body || {}); res.json({ ok: true, op: 'allergen_immunotherapy', result: r }); }));
router.post('/biologic_therapy', asyncH((req, res) => { const r = f.biologic_therapy(req.body || {}); res.json({ ok: true, op: 'biologic_therapy', result: r }); }));
router.post('/oral_immunotherapy', asyncH((req, res) => { const r = f.oral_immunotherapy(req.body || {}); res.json({ ok: true, op: 'oral_immunotherapy', result: r }); }));
router.post('/desensitization', asyncH((req, res) => { const r = f.desensitization(req.body || {}); res.json({ ok: true, op: 'desensitization', result: r }); }));
router.post('/immunosuppression', asyncH((req, res) => { const r = f.immunosuppression(req.body || {}); res.json({ ok: true, op: 'immunosuppression', result: r }); }));
module.exports = router;
