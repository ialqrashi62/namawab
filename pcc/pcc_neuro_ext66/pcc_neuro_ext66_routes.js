// Auto-generated routes
"use strict";
const express = require('express');
const {NeuroOncologyStagingExt, GliomaMolecularMarkerExt, MeningiomaGradingExt, PituitaryAdenomaExt, SchwannomaAssessmentExt, BrainMetastasisExt, PrimaryCNSLymphomaExt, SpinalCordTumorExt, TumorTreatmentResponseExt, NeuroOncRehabilitationExt} = require('./pcc_neuro_ext66_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'NeuroOncologyStagingExt'}, {name:'GliomaMolecularMarkerExt'}, {name:'MeningiomaGradingExt'}, {name:'PituitaryAdenomaExt'}, {name:'SchwannomaAssessmentExt'}, {name:'BrainMetastasisExt'}, {name:'PrimaryCNSLymphomaExt'}, {name:'SpinalCordTumorExt'}, {name:'TumorTreatmentResponseExt'}, {name:'NeuroOncRehabilitationExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['NeuroOncologyStagingExt', 'GliomaMolecularMarkerExt', 'MeningiomaGradingExt', 'PituitaryAdenomaExt', 'SchwannomaAssessmentExt', 'BrainMetastasisExt', 'PrimaryCNSLymphomaExt', 'SpinalCordTumorExt', 'TumorTreatmentResponseExt', 'NeuroOncRehabilitationExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;