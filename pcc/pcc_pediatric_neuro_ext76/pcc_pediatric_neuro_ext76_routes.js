// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricCognitiveDisorderExt, PediatricAnosognosiaExt, PediatricApraxiaExt, PediatricAgnosiaExt, PediatricExecDysfunctionExt, PediatricMemoryExt, PediatricVisuospatialExt, PediatricLanguageDisorderExt, PediatricBehavioralExecExt, PediatricTheoryMindExt} = require('./pcc_pediatric_neuro_ext76_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricCognitiveDisorderExt'}, {name:'PediatricAnosognosiaExt'}, {name:'PediatricApraxiaExt'}, {name:'PediatricAgnosiaExt'}, {name:'PediatricExecDysfunctionExt'}, {name:'PediatricMemoryExt'}, {name:'PediatricVisuospatialExt'}, {name:'PediatricLanguageDisorderExt'}, {name:'PediatricBehavioralExecExt'}, {name:'PediatricTheoryMindExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricCognitiveDisorderExt', 'PediatricAnosognosiaExt', 'PediatricApraxiaExt', 'PediatricAgnosiaExt', 'PediatricExecDysfunctionExt', 'PediatricMemoryExt', 'PediatricVisuospatialExt', 'PediatricLanguageDisorderExt', 'PediatricBehavioralExecExt', 'PediatricTheoryMindExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;