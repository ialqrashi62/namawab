// Auto-generated routes
"use strict";
const express = require('express');
const {TraumaticBrainInjuryExt, ConcussionAssessmentExt, PostConcussionSyndromeExt, ChronicTBIExt, SkullFractureExt, EpiduralHematomaExt, SubduralHematomaExt, TraumaticSAHExt, DiffuseAxonalInjuryExt, CerebralEdemaTBIExt} = require('./pcc_neuro_ext73_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'TraumaticBrainInjuryExt'}, {name:'ConcussionAssessmentExt'}, {name:'PostConcussionSyndromeExt'}, {name:'ChronicTBIExt'}, {name:'SkullFractureExt'}, {name:'EpiduralHematomaExt'}, {name:'SubduralHematomaExt'}, {name:'TraumaticSAHExt'}, {name:'DiffuseAxonalInjuryExt'}, {name:'CerebralEdemaTBIExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['TraumaticBrainInjuryExt', 'ConcussionAssessmentExt', 'PostConcussionSyndromeExt', 'ChronicTBIExt', 'SkullFractureExt', 'EpiduralHematomaExt', 'SubduralHematomaExt', 'TraumaticSAHExt', 'DiffuseAxonalInjuryExt', 'CerebralEdemaTBIExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;