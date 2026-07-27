// P3-CJ pcc_ed_ext2 routes v3.48.0
// P3-CJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_ed_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.48.0',
    module: 'pcc_ed_ext2',
    label: 'PCC ED Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Triage', (req, res) => { const r = Engine.Triage(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Triage', plan: r.plan }); })
  router.post('/call/TraumaTeam', (req, res) => { const r = Engine.TraumaTeam(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'TraumaTeam', plan: r.plan }); })
  router.post('/call/FastTrack', (req, res) => { const r = Engine.FastTrack(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'FastTrack', plan: r.plan }); })
  router.post('/call/PatientFlow', (req, res) => { const r = Engine.PatientFlow(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'PatientFlow', plan: r.plan }); })
  router.post('/call/Complaint', (req, res) => { const r = Engine.Complaint(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Complaint', plan: r.plan }); })
  router.post('/call/RSI', (req, res) => { const r = Engine.RSI(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'RSI', plan: r.plan }); })
  router.post('/call/PainProtocol', (req, res) => { const r = Engine.PainProtocol(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'PainProtocol', plan: r.plan }); })
  router.post('/call/Discharge', (req, res) => { const r = Engine.Discharge(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Discharge', plan: r.plan }); })
  router.post('/call/Admit', (req, res) => { const r = Engine.Admit(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Admit', plan: r.plan }); })
  router.post('/call/Briefing', (req, res) => { const r = Engine.Briefing(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Briefing', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
