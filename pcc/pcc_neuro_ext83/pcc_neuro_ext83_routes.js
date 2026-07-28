// Auto-generated routes
"use strict";
const express = require('express');
const {AtaxiaTelangiectasiaExt, FriedreichAtaxiaExt, SpinocerebellarAtaxiaExt, MSAExt, CerebellarAtaxiaExt, SensoryAtaxiaExt, VestibularAtaxiaExt, AtaxiaGeneticExt, AtaxiaRehabExt, AtaxiaMetabolicExt} = require('./pcc_neuro_ext83_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'AtaxiaTelangiectasiaExt'}, {name:'FriedreichAtaxiaExt'}, {name:'SpinocerebellarAtaxiaExt'}, {name:'MSAExt'}, {name:'CerebellarAtaxiaExt'}, {name:'SensoryAtaxiaExt'}, {name:'VestibularAtaxiaExt'}, {name:'AtaxiaGeneticExt'}, {name:'AtaxiaRehabExt'}, {name:'AtaxiaMetabolicExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['AtaxiaTelangiectasiaExt', 'FriedreichAtaxiaExt', 'SpinocerebellarAtaxiaExt', 'MSAExt', 'CerebellarAtaxiaExt', 'SensoryAtaxiaExt', 'VestibularAtaxiaExt', 'AtaxiaGeneticExt', 'AtaxiaRehabExt', 'AtaxiaMetabolicExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;