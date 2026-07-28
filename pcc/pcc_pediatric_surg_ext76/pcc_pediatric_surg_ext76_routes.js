// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricWadaTestExt, PediatricMEGSourceImagingExt, PediatricFunctionalMRSurgeryExt, PediatricLanguageMappingSurgExt, PediatricMemoryMappingExt, PediatricAwakeCraniotomyExt, PediatricEpilepsySurgeryEvalExt, PediatricSurgicalResectionCognExt, PediatricCogRehabPostExt, PediatricCognitiveScreeningExt} = require('./pcc_pediatric_surg_ext76_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricWadaTestExt'}, {name:'PediatricMEGSourceImagingExt'}, {name:'PediatricFunctionalMRSurgeryExt'}, {name:'PediatricLanguageMappingSurgExt'}, {name:'PediatricMemoryMappingExt'}, {name:'PediatricAwakeCraniotomyExt'}, {name:'PediatricEpilepsySurgeryEvalExt'}, {name:'PediatricSurgicalResectionCognExt'}, {name:'PediatricCogRehabPostExt'}, {name:'PediatricCognitiveScreeningExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricWadaTestExt', 'PediatricMEGSourceImagingExt', 'PediatricFunctionalMRSurgeryExt', 'PediatricLanguageMappingSurgExt', 'PediatricMemoryMappingExt', 'PediatricAwakeCraniotomyExt', 'PediatricEpilepsySurgeryEvalExt', 'PediatricSurgicalResectionCognExt', 'PediatricCogRehabPostExt', 'PediatricCognitiveScreeningExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;