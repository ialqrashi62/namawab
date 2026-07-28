// Auto-generated routes
"use strict";
const express = require('express');
const {HuntingtonDiseaseExt, HDEyeTrackerExt, HDFunctionalExt, HDNeuropsychExt, HDImagingExt, HDGeneticTestingExt, HDAntidopaminergicExt, HDSRP14003Ext, HDChoreaTreatmentExt, HDBehavioralMgmtExt} = require('./pcc_neuro_ext82_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'HuntingtonDiseaseExt'}, {name:'HDEyeTrackerExt'}, {name:'HDFunctionalExt'}, {name:'HDNeuropsychExt'}, {name:'HDImagingExt'}, {name:'HDGeneticTestingExt'}, {name:'HDAntidopaminergicExt'}, {name:'HDSRP14003Ext'}, {name:'HDChoreaTreatmentExt'}, {name:'HDBehavioralMgmtExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['HuntingtonDiseaseExt', 'HDEyeTrackerExt', 'HDFunctionalExt', 'HDNeuropsychExt', 'HDImagingExt', 'HDGeneticTestingExt', 'HDAntidopaminergicExt', 'HDSRP14003Ext', 'HDChoreaTreatmentExt', 'HDBehavioralMgmtExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;