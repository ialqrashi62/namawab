// Auto-generated routes
"use strict";
const express = require('express');
const {TBIRehabExt, SpinalCordInjuryRehabExt, StrokeRehabExt, BotulinumToxinExt, FESDeviceProgramExt, PressureUlcerManagementExt, NeurogenicBladderMgmtExt, WheelchairSeatingExt, NeuroAssistiveTechExt, OutpatientNeuroRehabExt} = require('./pcc_neuro_ext78_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'TBIRehabExt'}, {name:'SpinalCordInjuryRehabExt'}, {name:'StrokeRehabExt'}, {name:'BotulinumToxinExt'}, {name:'FESDeviceProgramExt'}, {name:'PressureUlcerManagementExt'}, {name:'NeurogenicBladderMgmtExt'}, {name:'WheelchairSeatingExt'}, {name:'NeuroAssistiveTechExt'}, {name:'OutpatientNeuroRehabExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['TBIRehabExt', 'SpinalCordInjuryRehabExt', 'StrokeRehabExt', 'BotulinumToxinExt', 'FESDeviceProgramExt', 'PressureUlcerManagementExt', 'NeurogenicBladderMgmtExt', 'WheelchairSeatingExt', 'NeuroAssistiveTechExt', 'OutpatientNeuroRehabExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;