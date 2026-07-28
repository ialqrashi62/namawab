// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricTBIExt, PediatricConcussionExt, PediatricPostConcussionExt, PediatricChronicTBIExt, PediatricSkullFractureExt, PediatricEpiduralHematomaExt, PediatricSubduralHematomaExt, PediatricTraumaticSAHExt, PediatricDiffuseAxonalInjuryExt, PediatricCerebralEdemaExt} = require('./pcc_pediatric_neuro_ext62_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricTBIExt'}, {name:'PediatricConcussionExt'}, {name:'PediatricPostConcussionExt'}, {name:'PediatricChronicTBIExt'}, {name:'PediatricSkullFractureExt'}, {name:'PediatricEpiduralHematomaExt'}, {name:'PediatricSubduralHematomaExt'}, {name:'PediatricTraumaticSAHExt'}, {name:'PediatricDiffuseAxonalInjuryExt'}, {name:'PediatricCerebralEdemaExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricTBIExt', 'PediatricConcussionExt', 'PediatricPostConcussionExt', 'PediatricChronicTBIExt', 'PediatricSkullFractureExt', 'PediatricEpiduralHematomaExt', 'PediatricSubduralHematomaExt', 'PediatricTraumaticSAHExt', 'PediatricDiffuseAxonalInjuryExt', 'PediatricCerebralEdemaExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;