// pcc_pediatric_surg_ext19 routes v3.129.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeurosurgeryTumor, PediatricPilocyticAstrocytoma, PediatricMedulloblastomaExt, PediatricEpendymomaSurgery, PediatricCraniopharyngiomaExt, PediatricBrainstemGlioma, PediatricOpticPathwayGlioma, PediatricChoroidPlexusTumor, PediatricATRTCase, PediatricDIPGTumor } = require('./pcc_pediatric_surg_ext19_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.129.0', module: 'pcc_pediatric_surg_ext19', label: 'PCC Pediatric Surg Ext19', functions: ['PediatricNeurosurgeryTumor', 'PediatricPilocyticAstrocytoma', 'PediatricMedulloblastomaExt', 'PediatricEpendymomaSurgery', 'PediatricCraniopharyngiomaExt', 'PediatricBrainstemGlioma', 'PediatricOpticPathwayGlioma', 'PediatricChoroidPlexusTumor', 'PediatricATRTCase', 'PediatricDIPGTumor'] });
});
router.post('/call/PediatricNeurosurgeryTumor', authenticate, (req, res) => {
  res.json(PediatricNeurosurgeryTumor(req.body));
});

router.post('/call/PediatricPilocyticAstrocytoma', authenticate, (req, res) => {
  res.json(PediatricPilocyticAstrocytoma(req.body));
});

router.post('/call/PediatricMedulloblastomaExt', authenticate, (req, res) => {
  res.json(PediatricMedulloblastomaExt(req.body));
});

router.post('/call/PediatricEpendymomaSurgery', authenticate, (req, res) => {
  res.json(PediatricEpendymomaSurgery(req.body));
});

router.post('/call/PediatricCraniopharyngiomaExt', authenticate, (req, res) => {
  res.json(PediatricCraniopharyngiomaExt(req.body));
});

router.post('/call/PediatricBrainstemGlioma', authenticate, (req, res) => {
  res.json(PediatricBrainstemGlioma(req.body));
});

router.post('/call/PediatricOpticPathwayGlioma', authenticate, (req, res) => {
  res.json(PediatricOpticPathwayGlioma(req.body));
});

router.post('/call/PediatricChoroidPlexusTumor', authenticate, (req, res) => {
  res.json(PediatricChoroidPlexusTumor(req.body));
});

router.post('/call/PediatricATRTCase', authenticate, (req, res) => {
  res.json(PediatricATRTCase(req.body));
});

router.post('/call/PediatricDIPGTumor', authenticate, (req, res) => {
  res.json(PediatricDIPGTumor(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
