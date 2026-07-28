// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricKetogenicDietExt, PediatricVagusNerveSurgExt, PediatricCallosotomyExt, PediatricHemispherectomyExt, PediatricLesionectomyExt, PediatricLaserAblationExt, PediatricRNSSurgExt, PediatricCordotomyExt, PediatricITBSurgExt, PediatricNeurostimExt} = require('./pcc_pediatric_surg_ext73_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricKetogenicDietExt'}, {name:'PediatricVagusNerveSurgExt'}, {name:'PediatricCallosotomyExt'}, {name:'PediatricHemispherectomyExt'}, {name:'PediatricLesionectomyExt'}, {name:'PediatricLaserAblationExt'}, {name:'PediatricRNSSurgExt'}, {name:'PediatricCordotomyExt'}, {name:'PediatricITBSurgExt'}, {name:'PediatricNeurostimExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricKetogenicDietExt', 'PediatricVagusNerveSurgExt', 'PediatricCallosotomyExt', 'PediatricHemispherectomyExt', 'PediatricLesionectomyExt', 'PediatricLaserAblationExt', 'PediatricRNSSurgExt', 'PediatricCordotomyExt', 'PediatricITBSurgExt', 'PediatricNeurostimExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;