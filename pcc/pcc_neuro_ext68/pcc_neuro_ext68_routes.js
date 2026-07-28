// Auto-generated routes
"use strict";
const express = require('express');
const {EpilepsyClassificationExt, StatusEpilepticusExt, RefractoryEpilepsyExt, EpilepsySurgeryEvalExt, VagalNerveStimTuningExt, RNSProgrammingExt, DBSForEpilepsyExt, KetogenicDietExt, ASMLevelExt, EpilepsyGeneticsExt} = require('./pcc_neuro_ext68_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'EpilepsyClassificationExt'}, {name:'StatusEpilepticusExt'}, {name:'RefractoryEpilepsyExt'}, {name:'EpilepsySurgeryEvalExt'}, {name:'VagalNerveStimTuningExt'}, {name:'RNSProgrammingExt'}, {name:'DBSForEpilepsyExt'}, {name:'KetogenicDietExt'}, {name:'ASMLevelExt'}, {name:'EpilepsyGeneticsExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['EpilepsyClassificationExt', 'StatusEpilepticusExt', 'RefractoryEpilepsyExt', 'EpilepsySurgeryEvalExt', 'VagalNerveStimTuningExt', 'RNSProgrammingExt', 'DBSForEpilepsyExt', 'KetogenicDietExt', 'ASMLevelExt', 'EpilepsyGeneticsExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;