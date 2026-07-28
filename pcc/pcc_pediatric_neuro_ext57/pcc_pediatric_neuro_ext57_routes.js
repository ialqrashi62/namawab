// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricEpilepsyClassificationExt, PediatricStatusEpilepticusExt, PediatricRefractoryEpilepsyExt, PediatricEpilepsySurgeryEvalExt, PediatricVagalNerveStimExt, PediatricRNSPlacementExt, PediatricDBSForEpilepsyExt, PediatricKetogenicDietExt, PediatricASMLevelExt, PediatricEpilepsyGeneticsExt} = require('./pcc_pediatric_neuro_ext57_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricEpilepsyClassificationExt'}, {name:'PediatricStatusEpilepticusExt'}, {name:'PediatricRefractoryEpilepsyExt'}, {name:'PediatricEpilepsySurgeryEvalExt'}, {name:'PediatricVagalNerveStimExt'}, {name:'PediatricRNSPlacementExt'}, {name:'PediatricDBSForEpilepsyExt'}, {name:'PediatricKetogenicDietExt'}, {name:'PediatricASMLevelExt'}, {name:'PediatricEpilepsyGeneticsExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricEpilepsyClassificationExt', 'PediatricStatusEpilepticusExt', 'PediatricRefractoryEpilepsyExt', 'PediatricEpilepsySurgeryEvalExt', 'PediatricVagalNerveStimExt', 'PediatricRNSPlacementExt', 'PediatricDBSForEpilepsyExt', 'PediatricKetogenicDietExt', 'PediatricASMLevelExt', 'PediatricEpilepsyGeneticsExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;