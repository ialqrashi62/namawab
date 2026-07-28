// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricAtaxiaDBSDeepStimExt, PediatricAtaxiaITBSurgExt, PediatricAtaxiaGeneticTestExt, PediatricAtaxiaStemCellExt, PediatricAtaxiaGeneTherapyExt, PediatricAtaxiaPhysioExt, PediatricAtaxiaOTExt, PediatricAtaxiaSpeechExt, PediatricAtaxiaSwallowExt, PediatricAtaxiaAssistiveExt} = require('./pcc_pediatric_surg_ext72_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricAtaxiaDBSDeepStimExt'}, {name:'PediatricAtaxiaITBSurgExt'}, {name:'PediatricAtaxiaGeneticTestExt'}, {name:'PediatricAtaxiaStemCellExt'}, {name:'PediatricAtaxiaGeneTherapyExt'}, {name:'PediatricAtaxiaPhysioExt'}, {name:'PediatricAtaxiaOTExt'}, {name:'PediatricAtaxiaSpeechExt'}, {name:'PediatricAtaxiaSwallowExt'}, {name:'PediatricAtaxiaAssistiveExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricAtaxiaDBSDeepStimExt', 'PediatricAtaxiaITBSurgExt', 'PediatricAtaxiaGeneticTestExt', 'PediatricAtaxiaStemCellExt', 'PediatricAtaxiaGeneTherapyExt', 'PediatricAtaxiaPhysioExt', 'PediatricAtaxiaOTExt', 'PediatricAtaxiaSpeechExt', 'PediatricAtaxiaSwallowExt', 'PediatricAtaxiaAssistiveExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;