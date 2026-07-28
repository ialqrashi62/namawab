// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricEpilepsySurgeryExt, PediatricHemispherotomyExt, PediatricCorpusCallosotomyExt, PediatricLesionectomyExt, PediatricLaserAblationEpilepsyExt, PediatricSurgicalResectionExt, PediatricSEEGPlacementExt, PediatricPhase2MonitoringExt, PediatricGridPlacementExt, PediatricResectiveEpilepsySurgeryExt} = require('./pcc_pediatric_surg_ext57_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricEpilepsySurgeryExt'}, {name:'PediatricHemispherotomyExt'}, {name:'PediatricCorpusCallosotomyExt'}, {name:'PediatricLesionectomyExt'}, {name:'PediatricLaserAblationEpilepsyExt'}, {name:'PediatricSurgicalResectionExt'}, {name:'PediatricSEEGPlacementExt'}, {name:'PediatricPhase2MonitoringExt'}, {name:'PediatricGridPlacementExt'}, {name:'PediatricResectiveEpilepsySurgeryExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricEpilepsySurgeryExt', 'PediatricHemispherotomyExt', 'PediatricCorpusCallosotomyExt', 'PediatricLesionectomyExt', 'PediatricLaserAblationEpilepsyExt', 'PediatricSurgicalResectionExt', 'PediatricSEEGPlacementExt', 'PediatricPhase2MonitoringExt', 'PediatricGridPlacementExt', 'PediatricResectiveEpilepsySurgeryExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;