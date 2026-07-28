// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricObstructiveHydroExt, PediatricCommunicatingHydroExt, PediatricNPHExt, PediatricProgrammableValveExt, PediatricETVExt, PediatricCPCExt, PediatricShuntTapExt, PediatricHydroCognitiveExt, PediatricHydroRehabExt, PediatricHydroBiomarkerExt} = require('./pcc_pediatric_neuro_ext68_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricObstructiveHydroExt'}, {name:'PediatricCommunicatingHydroExt'}, {name:'PediatricNPHExt'}, {name:'PediatricProgrammableValveExt'}, {name:'PediatricETVExt'}, {name:'PediatricCPCExt'}, {name:'PediatricShuntTapExt'}, {name:'PediatricHydroCognitiveExt'}, {name:'PediatricHydroRehabExt'}, {name:'PediatricHydroBiomarkerExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricObstructiveHydroExt', 'PediatricCommunicatingHydroExt', 'PediatricNPHExt', 'PediatricProgrammableValveExt', 'PediatricETVExt', 'PediatricCPCExt', 'PediatricShuntTapExt', 'PediatricHydroCognitiveExt', 'PediatricHydroRehabExt', 'PediatricHydroBiomarkerExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;