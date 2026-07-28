// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricICPMonitorExt, PediatricDecompressiveCraniectomyExt, PediatricHematomaEvacuationExt, PediatricCraniotomyTBISurgExt, PediatricCraniectomyBoneFlapExt, PediatricBoneFlapReplacementExt, PediatricDuralRepairExt, PediatricSkullFractureRepairExt, PediatricCerebralBloodFlowExt, PediatricNeurocriticalCareExt} = require('./pcc_pediatric_surg_ext62_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricICPMonitorExt'}, {name:'PediatricDecompressiveCraniectomyExt'}, {name:'PediatricHematomaEvacuationExt'}, {name:'PediatricCraniotomyTBISurgExt'}, {name:'PediatricCraniectomyBoneFlapExt'}, {name:'PediatricBoneFlapReplacementExt'}, {name:'PediatricDuralRepairExt'}, {name:'PediatricSkullFractureRepairExt'}, {name:'PediatricCerebralBloodFlowExt'}, {name:'PediatricNeurocriticalCareExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricICPMonitorExt', 'PediatricDecompressiveCraniectomyExt', 'PediatricHematomaEvacuationExt', 'PediatricCraniotomyTBISurgExt', 'PediatricCraniectomyBoneFlapExt', 'PediatricBoneFlapReplacementExt', 'PediatricDuralRepairExt', 'PediatricSkullFractureRepairExt', 'PediatricCerebralBloodFlowExt', 'PediatricNeurocriticalCareExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;