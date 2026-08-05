// pcc_pediatric_surg_ext38 routes v3.148.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeurosurgeryExt2, PediatricCraniopharyngiomaExt, PediatricMedulloblastomaExt, PediatricEpendymomaExt, PediatricAstrocytomaExt, PediatricGlioblastomaExt, PediatricDNETExt, PediatricGangliogliomaExt, PediatricPLEXExt, PediatricChoroidPlexusTumorExt } = require('./pcc_pediatric_surg_ext38_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.148.0', module: 'pcc_pediatric_surg_ext38', label: 'PCC Pediatric Surg Ext38', functions: ['PediatricNeurosurgeryExt2', 'PediatricCraniopharyngiomaExt', 'PediatricMedulloblastomaExt', 'PediatricEpendymomaExt', 'PediatricAstrocytomaExt', 'PediatricGlioblastomaExt', 'PediatricDNETExt', 'PediatricGangliogliomaExt', 'PediatricPLEXExt', 'PediatricChoroidPlexusTumorExt'] });
});
router.post('/call/PediatricNeurosurgeryExt2', authenticate, (req, res) => {
  res.json(PediatricNeurosurgeryExt2(req.body));
});

router.post('/call/PediatricCraniopharyngiomaExt', authenticate, (req, res) => {
  res.json(PediatricCraniopharyngiomaExt(req.body));
});

router.post('/call/PediatricMedulloblastomaExt', authenticate, (req, res) => {
  res.json(PediatricMedulloblastomaExt(req.body));
});

router.post('/call/PediatricEpendymomaExt', authenticate, (req, res) => {
  res.json(PediatricEpendymomaExt(req.body));
});

router.post('/call/PediatricAstrocytomaExt', authenticate, (req, res) => {
  res.json(PediatricAstrocytomaExt(req.body));
});

router.post('/call/PediatricGlioblastomaExt', authenticate, (req, res) => {
  res.json(PediatricGlioblastomaExt(req.body));
});

router.post('/call/PediatricDNETExt', authenticate, (req, res) => {
  res.json(PediatricDNETExt(req.body));
});

router.post('/call/PediatricGangliogliomaExt', authenticate, (req, res) => {
  res.json(PediatricGangliogliomaExt(req.body));
});

router.post('/call/PediatricPLEXExt', authenticate, (req, res) => {
  res.json(PediatricPLEXExt(req.body));
});

router.post('/call/PediatricChoroidPlexusTumorExt', authenticate, (req, res) => {
  res.json(PediatricChoroidPlexusTumorExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
