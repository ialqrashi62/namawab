const express = require('express');
const router = express.Router();
const { funcs } = require('./tier94_pulm_pleural_497_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pleural_effusion', asyncH((req, res) => { const r = f.pleural_effusion(req.body || {}); res.json({ ok: true, op: 'pleural_effusion', result: r }); }));
router.post('/thoracentesis', asyncH((req, res) => { const r = f.thoracentesis(req.body || {}); res.json({ ok: true, op: 'thoracentesis', result: r }); }));
router.post('/chest_tube', asyncH((req, res) => { const r = f.chest_tube(req.body || {}); res.json({ ok: true, op: 'chest_tube', result: r }); }));
router.post('/pleurodesis', asyncH((req, res) => { const r = f.pleurodesis(req.body || {}); res.json({ ok: true, op: 'pleurodesis', result: r }); }));
router.post('/empyema', asyncH((req, res) => { const r = f.empyema(req.body || {}); res.json({ ok: true, op: 'empyema', result: r }); }));
module.exports = router;
