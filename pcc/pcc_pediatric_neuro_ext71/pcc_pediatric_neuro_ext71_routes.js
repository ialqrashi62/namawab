// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricHuntingtonExt, PediatricJuvenileHDExt, PediatricHDLBDegExt, PediatricHDNeuroExt, PediatricHDEyeTrackExt, PediatricHDTFCScoreExt, PediatricHDBaselineExt, PediatricHDFamilyHxExt, PediatricHDGeneticCounselExt, PediatricHDBehavioralExt} = require('./pcc_pediatric_neuro_ext71_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricHuntingtonExt'}, {name:'PediatricJuvenileHDExt'}, {name:'PediatricHDLBDegExt'}, {name:'PediatricHDNeuroExt'}, {name:'PediatricHDEyeTrackExt'}, {name:'PediatricHDTFCScoreExt'}, {name:'PediatricHDBaselineExt'}, {name:'PediatricHDFamilyHxExt'}, {name:'PediatricHDGeneticCounselExt'}, {name:'PediatricHDBehavioralExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricHuntingtonExt', 'PediatricJuvenileHDExt', 'PediatricHDLBDegExt', 'PediatricHDNeuroExt', 'PediatricHDEyeTrackExt', 'PediatricHDTFCScoreExt', 'PediatricHDBaselineExt', 'PediatricHDFamilyHxExt', 'PediatricHDGeneticCounselExt', 'PediatricHDBehavioralExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;