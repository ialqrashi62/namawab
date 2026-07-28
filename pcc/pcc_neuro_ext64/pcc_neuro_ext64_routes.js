// Auto-generated routes
"use strict";
const express = require('express');
const {IdiopathicIntracranialHypertensionExt3, VenousSinusStenosisStentingExt, CSFLeakSiteLocalizationExt, SpontaneousIntracranialHypotensionExt, ChiariMalformationComplexExt, SyringomyeliaMonitoringExt, BasilarInvaginationExt, CraniovertebralJunctionAnomalyExt, CSFFlowDynamicsExt, EmptySellaSyndromeMonitorExt} = require('./pcc_neuro_ext64_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'IdiopathicIntracranialHypertensionExt3'}, {name:'VenousSinusStenosisStentingExt'}, {name:'CSFLeakSiteLocalizationExt'}, {name:'SpontaneousIntracranialHypotensionExt'}, {name:'ChiariMalformationComplexExt'}, {name:'SyringomyeliaMonitoringExt'}, {name:'BasilarInvaginationExt'}, {name:'CraniovertebralJunctionAnomalyExt'}, {name:'CSFFlowDynamicsExt'}, {name:'EmptySellaSyndromeMonitorExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['IdiopathicIntracranialHypertensionExt3', 'VenousSinusStenosisStentingExt', 'CSFLeakSiteLocalizationExt', 'SpontaneousIntracranialHypotensionExt', 'ChiariMalformationComplexExt', 'SyringomyeliaMonitoringExt', 'BasilarInvaginationExt', 'CraniovertebralJunctionAnomalyExt', 'CSFFlowDynamicsExt', 'EmptySellaSyndromeMonitorExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;