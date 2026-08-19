const express = require('express');
const router = express.Router();
const { funcs } = require('./tier103_pathology_538_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/histology_review', asyncH((req, res) => { const r = f.histology_review(req.body || {}); res.json({ ok: true, op: 'histology_review', result: r }); }));
router.post('/cytology', asyncH((req, res) => { const r = f.cytology(req.body || {}); res.json({ ok: true, op: 'cytology', result: r }); }));
router.post('/frozen_section', asyncH((req, res) => { const r = f.frozen_section(req.body || {}); res.json({ ok: true, op: 'frozen_section', result: r }); }));
router.post('/molecular_path', asyncH((req, res) => { const r = f.molecular_path(req.body || {}); res.json({ ok: true, op: 'molecular_path', result: r }); }));
router.post('/autopsy', asyncH((req, res) => { const r = f.autopsy(req.body || {}); res.json({ ok: true, op: 'autopsy', result: r }); }));
module.exports = router;
