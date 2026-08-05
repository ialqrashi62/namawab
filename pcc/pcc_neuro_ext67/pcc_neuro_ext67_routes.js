// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext67';
const {StrokeRecoveryAssessmentExt, AphasiaAssessmentExt, DysphagiaManagementExt, SpasticityTreatmentExt, NeurogenicBladderExt, PoststrokeDepressionExt, PoststrokeSeizureExt, MotorRecoveryTrackingExt, CognitiveRehabExt, VocationalRehabExt} = require('./pcc_neuro_ext67_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'StrokeRecoveryAssessmentExt'}, {name:'AphasiaAssessmentExt'}, {name:'DysphagiaManagementExt'}, {name:'SpasticityTreatmentExt'}, {name:'NeurogenicBladderExt'}, {name:'PoststrokeDepressionExt'}, {name:'PoststrokeSeizureExt'}, {name:'MotorRecoveryTrackingExt'}, {name:'CognitiveRehabExt'}, {name:'VocationalRehabExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['StrokeRecoveryAssessmentExt', 'AphasiaAssessmentExt', 'DysphagiaManagementExt', 'SpasticityTreatmentExt', 'NeurogenicBladderExt', 'PoststrokeDepressionExt', 'PoststrokeSeizureExt', 'MotorRecoveryTrackingExt', 'CognitiveRehabExt', 'VocationalRehabExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;