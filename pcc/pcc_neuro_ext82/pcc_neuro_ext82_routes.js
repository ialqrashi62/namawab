// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext82';
const {HuntingtonDiseaseExt, HDEyeTrackerExt, HDFunctionalExt, HDNeuropsychExt, HDImagingExt, HDGeneticTestingExt, HDAntidopaminergicExt, HDSRP14003Ext, HDChoreaTreatmentExt, HDBehavioralMgmtExt} = require('./pcc_neuro_ext82_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'HuntingtonDiseaseExt'}, {name:'HDEyeTrackerExt'}, {name:'HDFunctionalExt'}, {name:'HDNeuropsychExt'}, {name:'HDImagingExt'}, {name:'HDGeneticTestingExt'}, {name:'HDAntidopaminergicExt'}, {name:'HDSRP14003Ext'}, {name:'HDChoreaTreatmentExt'}, {name:'HDBehavioralMgmtExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['HuntingtonDiseaseExt', 'HDEyeTrackerExt', 'HDFunctionalExt', 'HDNeuropsychExt', 'HDImagingExt', 'HDGeneticTestingExt', 'HDAntidopaminergicExt', 'HDSRP14003Ext', 'HDChoreaTreatmentExt', 'HDBehavioralMgmtExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;