// Auto-generated routes
"use strict";
const express = require('express');
const {StrokeRecoveryAssessmentExt, AphasiaAssessmentExt, DysphagiaManagementExt, SpasticityTreatmentExt, NeurogenicBladderExt, PoststrokeDepressionExt, PoststrokeSeizureExt, MotorRecoveryTrackingExt, CognitiveRehabExt, VocationalRehabExt} = require('./pcc_neuro_ext67_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'StrokeRecoveryAssessmentExt'}, {name:'AphasiaAssessmentExt'}, {name:'DysphagiaManagementExt'}, {name:'SpasticityTreatmentExt'}, {name:'NeurogenicBladderExt'}, {name:'PoststrokeDepressionExt'}, {name:'PoststrokeSeizureExt'}, {name:'MotorRecoveryTrackingExt'}, {name:'CognitiveRehabExt'}, {name:'VocationalRehabExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['StrokeRecoveryAssessmentExt', 'AphasiaAssessmentExt', 'DysphagiaManagementExt', 'SpasticityTreatmentExt', 'NeurogenicBladderExt', 'PoststrokeDepressionExt', 'PoststrokeSeizureExt', 'MotorRecoveryTrackingExt', 'CognitiveRehabExt', 'VocationalRehabExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;