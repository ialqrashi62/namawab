// P3-CJ pcc_ed_ext2 routes v3.48.0
// P3-CJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_ed_ext2';
const F = require('./pcc_ed_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.48.0',
    module: 'pcc_ed_ext2',
    label: 'PCC ED Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/Triage', (req, res) => { const r = F.Triage(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Triage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/TraumaTeam', (req, res) => { const r = F.TraumaTeam(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'TraumaTeam', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FastTrack', (req, res) => { const r = F.FastTrack(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'FastTrack', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PatientFlow', (req, res) => { const r = F.PatientFlow(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'PatientFlow', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Complaint', (req, res) => { const r = F.Complaint(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Complaint', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/RSI', (req, res) => { const r = F.RSI(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'RSI', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PainProtocol', (req, res) => { const r = F.PainProtocol(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'PainProtocol', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Discharge', (req, res) => { const r = F.Discharge(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Discharge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Admit', (req, res) => { const r = F.Admit(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Admit', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Briefing', (req, res) => { const r = F.Briefing(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: 'Briefing', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.48.0', module: 'pcc_ed_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
