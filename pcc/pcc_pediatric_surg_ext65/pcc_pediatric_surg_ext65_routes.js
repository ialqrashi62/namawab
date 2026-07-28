// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricVestibularSurgeryExt, PediatricLabyrinthectomyExt, PediatricEndolymphaticShuntExt, PediatricAcousticNeuromaResectExt, PediatricRetrosigmoidApproachExt, PediatricMiddleFossaApproachExt, PediatricVestibularNerveSectionExt, PediatricHearingRehabExt, PediatricBalanceTherapyExt, PediatricPositionalTrainingExt} = require('./pcc_pediatric_surg_ext65_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricVestibularSurgeryExt'}, {name:'PediatricLabyrinthectomyExt'}, {name:'PediatricEndolymphaticShuntExt'}, {name:'PediatricAcousticNeuromaResectExt'}, {name:'PediatricRetrosigmoidApproachExt'}, {name:'PediatricMiddleFossaApproachExt'}, {name:'PediatricVestibularNerveSectionExt'}, {name:'PediatricHearingRehabExt'}, {name:'PediatricBalanceTherapyExt'}, {name:'PediatricPositionalTrainingExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricVestibularSurgeryExt', 'PediatricLabyrinthectomyExt', 'PediatricEndolymphaticShuntExt', 'PediatricAcousticNeuromaResectExt', 'PediatricRetrosigmoidApproachExt', 'PediatricMiddleFossaApproachExt', 'PediatricVestibularNerveSectionExt', 'PediatricHearingRehabExt', 'PediatricBalanceTherapyExt', 'PediatricPositionalTrainingExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;