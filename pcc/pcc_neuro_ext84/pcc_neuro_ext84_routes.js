// Auto-generated routes
"use strict";
const express = require('express');
const {DementiaScreeningExt, AlzheimersDementiaExt, LewyBodyDementiaExt, VascularDementiaExt, FTDBehavioralExt, FTDLanguageExt, PosteriorCorticalAtrophyExt, DLBvsADDExt, DementiaTreatmentExt, DementiaBehavioralExt} = require('./pcc_neuro_ext84_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'DementiaScreeningExt'}, {name:'AlzheimersDementiaExt'}, {name:'LewyBodyDementiaExt'}, {name:'VascularDementiaExt'}, {name:'FTDBehavioralExt'}, {name:'FTDLanguageExt'}, {name:'PosteriorCorticalAtrophyExt'}, {name:'DLBvsADDExt'}, {name:'DementiaTreatmentExt'}, {name:'DementiaBehavioralExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['DementiaScreeningExt', 'AlzheimersDementiaExt', 'LewyBodyDementiaExt', 'VascularDementiaExt', 'FTDBehavioralExt', 'FTDLanguageExt', 'PosteriorCorticalAtrophyExt', 'DLBvsADDExt', 'DementiaTreatmentExt', 'DementiaBehavioralExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;