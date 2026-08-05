// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext81';
const {ParkinsonDiseaseExt, PDLevodopaResponseExt, PDMedicationExt, PDDBSProgrammingExt, PDDBSBatteryExt, PDSubthalamicDBSExt, PDGpiDBSExt, PDVimDBSETCenterExt, PDLevodopaCarbidopaInfusionExt, PDApomorphineInfusionExt} = require('./pcc_neuro_ext81_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'ParkinsonDiseaseExt'}, {name:'PDLevodopaResponseExt'}, {name:'PDMedicationExt'}, {name:'PDDBSProgrammingExt'}, {name:'PDDBSBatteryExt'}, {name:'PDSubthalamicDBSExt'}, {name:'PDGpiDBSExt'}, {name:'PDVimDBSETCenterExt'}, {name:'PDLevodopaCarbidopaInfusionExt'}, {name:'PDApomorphineInfusionExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['ParkinsonDiseaseExt', 'PDLevodopaResponseExt', 'PDMedicationExt', 'PDDBSProgrammingExt', 'PDDBSBatteryExt', 'PDSubthalamicDBSExt', 'PDGpiDBSExt', 'PDVimDBSETCenterExt', 'PDLevodopaCarbidopaInfusionExt', 'PDApomorphineInfusionExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;