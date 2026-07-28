// Auto-generated routes
"use strict";
const express = require('express');
const {VertigoDisorderExt, BPPVExt, VestibularNeuritisExt, MeniereDiseaseExt, AcousticNeuromaExt, VestibularMigraineExt, MotionSicknessExt, BilateralVestibularExt, VEMPTestExt, OcularMotorExamExt} = require('./pcc_neuro_ext76_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'VertigoDisorderExt'}, {name:'BPPVExt'}, {name:'VestibularNeuritisExt'}, {name:'MeniereDiseaseExt'}, {name:'AcousticNeuromaExt'}, {name:'VestibularMigraineExt'}, {name:'MotionSicknessExt'}, {name:'BilateralVestibularExt'}, {name:'VEMPTestExt'}, {name:'OcularMotorExamExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['VertigoDisorderExt', 'BPPVExt', 'VestibularNeuritisExt', 'MeniereDiseaseExt', 'AcousticNeuromaExt', 'VestibularMigraineExt', 'MotionSicknessExt', 'BilateralVestibularExt', 'VEMPTestExt', 'OcularMotorExamExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;