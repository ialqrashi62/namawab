// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pediatric_surg_ext52';
const {PediatricNeuroAtherosclerosisSurgeryExt, PediatricBypassProcedureExt, PediatricECICProcedureExt, PediatricMicrobleedsResectionExt, PediatricSiderosisCavityExt, PediatricRadiationNecrosisResectionExt, PediatricPCAOccipitalStimulatorExt, PediatricPPAVagusNerveStimExt, PediatricCBDPallidotomyExt, PediatricPSPDeepBrainStimExt} = require('./pcc_pediatric_surg_ext52_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:"PediatricNeuroAtherosclerosisSurgeryExt"}, {name:"PediatricBypassProcedureExt"}, {name:"PediatricECICProcedureExt"}, {name:"PediatricMicrobleedsResectionExt"}, {name:"PediatricSiderosisCavityExt"}, {name:"PediatricRadiationNecrosisResectionExt"}, {name:"PediatricPCAOccipitalStimulatorExt"}, {name:"PediatricPPAVagusNerveStimExt"}, {name:"PediatricCBDPallidotomyExt"}, {name:"PediatricPSPDeepBrainStimExt"}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; if(!fn.startsWith('pcc_pediatric_surg_ext52_')) return res.status(400).json({error:'bad fn'}); const f=eval(fn); const r=f(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;