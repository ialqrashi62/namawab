const express = require('express');
const router = express.Router();
const { funcs } = require('./tier115_ophthalmology_608_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cataract_surgery', asyncH((req, res) => { const r = f.cataract_surgery(req.body || {}); res.json({ ok: true, op: 'cataract_surgery', result: r }); }));
router.post('/retinal_detachment', asyncH((req, res) => { const r = f.retinal_detachment(req.body || {}); res.json({ ok: true, op: 'retinal_detachment', result: r }); }));
router.post('/glaucoma_surgery', asyncH((req, res) => { const r = f.glaucoma_surgery(req.body || {}); res.json({ ok: true, op: 'glaucoma_surgery', result: r }); }));
router.post('/refractive_surgery', asyncH((req, res) => { const r = f.refractive_surgery(req.body || {}); res.json({ ok: true, op: 'refractive_surgery', result: r }); }));
router.post('/corneal_transplant', asyncH((req, res) => { const r = f.corneal_transplant(req.body || {}); res.json({ ok: true, op: 'corneal_transplant', result: r }); }));
module.exports = router;
