const express = require('express');
const router = express.Router();
const { funcs } = require('./tier97_neph_glomerular_509_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/glomerulonephritis', asyncH((req, res) => { const r = f.glomerulonephritis(req.body || {}); res.json({ ok: true, op: 'glomerulonephritis', result: r }); }));
router.post('/diabetic_nephropathy', asyncH((req, res) => { const r = f.diabetic_nephropathy(req.body || {}); res.json({ ok: true, op: 'diabetic_nephropathy', result: r }); }));
router.post('/polycystic_kidney', asyncH((req, res) => { const r = f.polycystic_kidney(req.body || {}); res.json({ ok: true, op: 'polycystic_kidney', result: r }); }));
router.post('/renal_transplant', asyncH((req, res) => { const r = f.renal_transplant(req.body || {}); res.json({ ok: true, op: 'renal_transplant', result: r }); }));
router.post('/renal_stones', asyncH((req, res) => { const r = f.renal_stones(req.body || {}); res.json({ ok: true, op: 'renal_stones', result: r }); }));
module.exports = router;
