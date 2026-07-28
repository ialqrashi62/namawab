// Auto-generated routes
"use strict";
const express = require('express');
const {SialorrheaManagementExt, SpasticityOralExt, DysarthriaAssessmentExt, DysphagiaScreeningExt, PEGPlacementExt, TracheostomyDecannulationExt, RespiratoryAssessmentExt, VentManagementExt, SleepApneaStrokeExt, GIAssessmentNeuroExt} = require('./pcc_neuro_ext86_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'SialorrheaManagementExt'}, {name:'SpasticityOralExt'}, {name:'DysarthriaAssessmentExt'}, {name:'DysphagiaScreeningExt'}, {name:'PEGPlacementExt'}, {name:'TracheostomyDecannulationExt'}, {name:'RespiratoryAssessmentExt'}, {name:'VentManagementExt'}, {name:'SleepApneaStrokeExt'}, {name:'GIAssessmentNeuroExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['SialorrheaManagementExt', 'SpasticityOralExt', 'DysarthriaAssessmentExt', 'DysphagiaScreeningExt', 'PEGPlacementExt', 'TracheostomyDecannulationExt', 'RespiratoryAssessmentExt', 'VentManagementExt', 'SleepApneaStrokeExt', 'GIAssessmentNeuroExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;