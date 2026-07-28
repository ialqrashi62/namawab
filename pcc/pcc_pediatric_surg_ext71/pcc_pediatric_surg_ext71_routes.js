// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricDBSChoreaExt, PediatricDBSDystoniaExt, PediatricDBSHDGpiExt, PediatricDeepBrainStimTrialExt, PediatricGeneTherapyExt, PediatricASOSTrialExt, PediatricASHLExt, PediatricPDE10Ext, PediatricNeuropsychTestingExt, PediatricOccupationalTherapyExt} = require('./pcc_pediatric_surg_ext71_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricDBSChoreaExt'}, {name:'PediatricDBSDystoniaExt'}, {name:'PediatricDBSHDGpiExt'}, {name:'PediatricDeepBrainStimTrialExt'}, {name:'PediatricGeneTherapyExt'}, {name:'PediatricASOSTrialExt'}, {name:'PediatricASHLExt'}, {name:'PediatricPDE10Ext'}, {name:'PediatricNeuropsychTestingExt'}, {name:'PediatricOccupationalTherapyExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricDBSChoreaExt', 'PediatricDBSDystoniaExt', 'PediatricDBSHDGpiExt', 'PediatricDeepBrainStimTrialExt', 'PediatricGeneTherapyExt', 'PediatricASOSTrialExt', 'PediatricASHLExt', 'PediatricPDE10Ext', 'PediatricNeuropsychTestingExt', 'PediatricOccupationalTherapyExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;