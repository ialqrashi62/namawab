// P3-CR pcc_surgical_checklist routes v3.56.0
// P3-CR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_surgical_checklist';
const F = require('./pcc_surgical_checklist_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.56.0',
    module: 'pcc_surgical_checklist',
    label: 'PCC Surgical Checklist',
    functions: Object.keys(F),
  });
});
  router.post('/call/SignIn', (req, res) => { const r = F.SignIn(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SignIn', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/TimeOut', (req, res) => { const r = F.TimeOut(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'TimeOut', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SignOut', (req, res) => { const r = F.SignOut(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SignOut', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SiteMark', (req, res) => { const r = F.SiteMark(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SiteMark', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/AllergyCheck', (req, res) => { const r = F.AllergyCheck(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'AllergyCheck', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/AntibioConfirm', (req, res) => { const r = F.AntibioConfirm(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'AntibioConfirm', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/ImplantConfirm', (req, res) => { const r = F.ImplantConfirm(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'ImplantConfirm', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/CountsFinal', (req, res) => { const r = F.CountsFinal(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'CountsFinal', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SpecimenConfirm', (req, res) => { const r = F.SpecimenConfirm(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SpecimenConfirm', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Recovery', (req, res) => { const r = F.Recovery(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'Recovery', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
