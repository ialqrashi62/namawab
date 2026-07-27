// P3-CR pcc_surgical_checklist routes v3.56.0
// P3-CR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_surgical_checklist_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.56.0',
    module: 'pcc_surgical_checklist',
    label: 'PCC Surgical Checklist',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/SignIn', (req, res) => { const r = Engine.SignIn(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SignIn', plan: r.plan }); })
  router.post('/call/TimeOut', (req, res) => { const r = Engine.TimeOut(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'TimeOut', plan: r.plan }); })
  router.post('/call/SignOut', (req, res) => { const r = Engine.SignOut(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SignOut', plan: r.plan }); })
  router.post('/call/SiteMark', (req, res) => { const r = Engine.SiteMark(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SiteMark', plan: r.plan }); })
  router.post('/call/AllergyCheck', (req, res) => { const r = Engine.AllergyCheck(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'AllergyCheck', plan: r.plan }); })
  router.post('/call/AntibioConfirm', (req, res) => { const r = Engine.AntibioConfirm(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'AntibioConfirm', plan: r.plan }); })
  router.post('/call/ImplantConfirm', (req, res) => { const r = Engine.ImplantConfirm(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'ImplantConfirm', plan: r.plan }); })
  router.post('/call/CountsFinal', (req, res) => { const r = Engine.CountsFinal(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'CountsFinal', plan: r.plan }); })
  router.post('/call/SpecimenConfirm', (req, res) => { const r = Engine.SpecimenConfirm(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'SpecimenConfirm', plan: r.plan }); })
  router.post('/call/Recovery', (req, res) => { const r = Engine.Recovery(req.body || {}); res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: 'Recovery', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.56.0', module: 'pcc_surgical_checklist', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
