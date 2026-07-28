// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricDementiaScreeningExt, PediatricNiemannPickExt, PediatricTaySachsExt, PediatricBattenDiseaseExt, PediatricLeukodystrophyExt, PediatricALDGenExt, PediatricPKUExt, PediatricMLDExt, PediatricMitochondrialExt, PediatricScreenDevelopmentalExt} = require('./pcc_pediatric_neuro_ext73_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricDementiaScreeningExt'}, {name:'PediatricNiemannPickExt'}, {name:'PediatricTaySachsExt'}, {name:'PediatricBattenDiseaseExt'}, {name:'PediatricLeukodystrophyExt'}, {name:'PediatricALDGenExt'}, {name:'PediatricPKUExt'}, {name:'PediatricMLDExt'}, {name:'PediatricMitochondrialExt'}, {name:'PediatricScreenDevelopmentalExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricDementiaScreeningExt', 'PediatricNiemannPickExt', 'PediatricTaySachsExt', 'PediatricBattenDiseaseExt', 'PediatricLeukodystrophyExt', 'PediatricALDGenExt', 'PediatricPKUExt', 'PediatricMLDExt', 'PediatricMitochondrialExt', 'PediatricScreenDevelopmentalExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;