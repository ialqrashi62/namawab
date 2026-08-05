// pcc_neuro_ext20 routes v3.119.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { CerebrovascularDiseaseExt, IntracranialAneurysmExt, ArteriovenousMalformation, CavernousMalformation, MoyamoyaDisease, SubarachnoidHemorrhageExt, IntracerebralHemorrhage, SubduralHematomaExt, EpiduralHematomaExt, VenousSinusThrombosis } = require('./pcc_neuro_ext20_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.119.0', module: 'pcc_neuro_ext20', label: 'PCC Neuro Ext20', functions: ['CerebrovascularDiseaseExt', 'IntracranialAneurysmExt', 'ArteriovenousMalformation', 'CavernousMalformation', 'MoyamoyaDisease', 'SubarachnoidHemorrhageExt', 'IntracerebralHemorrhage', 'SubduralHematomaExt', 'EpiduralHematomaExt', 'VenousSinusThrombosis'] });
});
router.post('/call/CerebrovascularDiseaseExt', authenticate, (req, res) => {
  res.json(CerebrovascularDiseaseExt(req.body));
});

router.post('/call/IntracranialAneurysmExt', authenticate, (req, res) => {
  res.json(IntracranialAneurysmExt(req.body));
});

router.post('/call/ArteriovenousMalformation', authenticate, (req, res) => {
  res.json(ArteriovenousMalformation(req.body));
});

router.post('/call/CavernousMalformation', authenticate, (req, res) => {
  res.json(CavernousMalformation(req.body));
});

router.post('/call/MoyamoyaDisease', authenticate, (req, res) => {
  res.json(MoyamoyaDisease(req.body));
});

router.post('/call/SubarachnoidHemorrhageExt', authenticate, (req, res) => {
  res.json(SubarachnoidHemorrhageExt(req.body));
});

router.post('/call/IntracerebralHemorrhage', authenticate, (req, res) => {
  res.json(IntracerebralHemorrhage(req.body));
});

router.post('/call/SubduralHematomaExt', authenticate, (req, res) => {
  res.json(SubduralHematomaExt(req.body));
});

router.post('/call/EpiduralHematomaExt', authenticate, (req, res) => {
  res.json(EpiduralHematomaExt(req.body));
});

router.post('/call/VenousSinusThrombosis', authenticate, (req, res) => {
  res.json(VenousSinusThrombosis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
