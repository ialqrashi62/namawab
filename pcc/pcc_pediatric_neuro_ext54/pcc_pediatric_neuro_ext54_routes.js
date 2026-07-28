// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricNeurodegenerativeExt, PediatricMovementDisorderExt, PediatricDystoniaClassificationExt, PediatricAtaxiaDiagnosticExt, PediatricChoreaDisorderExt, PediatricTremorPhenotypeExt, PediatricTicDisorderExt, PediatricMyoclonusExt, PediatricParkinsonismExt, PediatricNeuroacanthocytosisExt} = require('./pcc_pediatric_neuro_ext54_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricNeurodegenerativeExt'}, {name:'PediatricMovementDisorderExt'}, {name:'PediatricDystoniaClassificationExt'}, {name:'PediatricAtaxiaDiagnosticExt'}, {name:'PediatricChoreaDisorderExt'}, {name:'PediatricTremorPhenotypeExt'}, {name:'PediatricTicDisorderExt'}, {name:'PediatricMyoclonusExt'}, {name:'PediatricParkinsonismExt'}, {name:'PediatricNeuroacanthocytosisExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricNeurodegenerativeExt', 'PediatricMovementDisorderExt', 'PediatricDystoniaClassificationExt', 'PediatricAtaxiaDiagnosticExt', 'PediatricChoreaDisorderExt', 'PediatricTremorPhenotypeExt', 'PediatricTicDisorderExt', 'PediatricMyoclonusExt', 'PediatricParkinsonismExt', 'PediatricNeuroacanthocytosisExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;