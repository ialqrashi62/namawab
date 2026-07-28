// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricLaserAblationSurgExt, PediatricSEEGPlacementExt, PediatricStripGridPlacementExt, PediatricPhase2MonitoringExt, PediatricResectiveSurgeryExt, PediatricAHSSSurgeryExt, PediatricCorpusCallosotomySurgExt, PediatricLesionectomySurgExt, PediatricMinimallyInvasiveExt, PediatricEpilepsyRehabPostExt} = require('./pcc_pediatric_surg_ext77_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricLaserAblationSurgExt'}, {name:'PediatricSEEGPlacementExt'}, {name:'PediatricStripGridPlacementExt'}, {name:'PediatricPhase2MonitoringExt'}, {name:'PediatricResectiveSurgeryExt'}, {name:'PediatricAHSSSurgeryExt'}, {name:'PediatricCorpusCallosotomySurgExt'}, {name:'PediatricLesionectomySurgExt'}, {name:'PediatricMinimallyInvasiveExt'}, {name:'PediatricEpilepsyRehabPostExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricLaserAblationSurgExt', 'PediatricSEEGPlacementExt', 'PediatricStripGridPlacementExt', 'PediatricPhase2MonitoringExt', 'PediatricResectiveSurgeryExt', 'PediatricAHSSSurgeryExt', 'PediatricCorpusCallosotomySurgExt', 'PediatricLesionectomySurgExt', 'PediatricMinimallyInvasiveExt', 'PediatricEpilepsyRehabPostExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;