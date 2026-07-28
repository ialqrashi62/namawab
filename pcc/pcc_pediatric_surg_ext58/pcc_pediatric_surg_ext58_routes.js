// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricTrigeminalSurgeryExt, PediatricMVDExt, PediatricGammaKnifeHeadacheExt, PediatricClusterSurgeryExt, PediatricMigraineSurgeryExt, PediatricOccipitalStimExt, PediatricVCNSSurgeryExt, PediatricBotoxInjectionExt, PediatricHeadacheBlockExt, PediatricPNSMigraineExt} = require('./pcc_pediatric_surg_ext58_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricTrigeminalSurgeryExt'}, {name:'PediatricMVDExt'}, {name:'PediatricGammaKnifeHeadacheExt'}, {name:'PediatricClusterSurgeryExt'}, {name:'PediatricMigraineSurgeryExt'}, {name:'PediatricOccipitalStimExt'}, {name:'PediatricVCNSSurgeryExt'}, {name:'PediatricBotoxInjectionExt'}, {name:'PediatricHeadacheBlockExt'}, {name:'PediatricPNSMigraineExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricTrigeminalSurgeryExt', 'PediatricMVDExt', 'PediatricGammaKnifeHeadacheExt', 'PediatricClusterSurgeryExt', 'PediatricMigraineSurgeryExt', 'PediatricOccipitalStimExt', 'PediatricVCNSSurgeryExt', 'PediatricBotoxInjectionExt', 'PediatricHeadacheBlockExt', 'PediatricPNSMigraineExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;