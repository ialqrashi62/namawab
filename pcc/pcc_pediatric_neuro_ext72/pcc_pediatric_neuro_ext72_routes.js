// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricATExt, PediatricFAExt, PediatricSCAExt, PediatricMSAExt, PediatricCerebellarAtaxiaExt, PediatricSensoryAtaxiaExt, PediatricVestibularAtaxiaExt, PediatricAtaxiaGeneticExt, PediatricAtaxiaRehabExt, PediatricAtaxiaMetabolicExt} = require('./pcc_pediatric_neuro_ext72_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricATExt'}, {name:'PediatricFAExt'}, {name:'PediatricSCAExt'}, {name:'PediatricMSAExt'}, {name:'PediatricCerebellarAtaxiaExt'}, {name:'PediatricSensoryAtaxiaExt'}, {name:'PediatricVestibularAtaxiaExt'}, {name:'PediatricAtaxiaGeneticExt'}, {name:'PediatricAtaxiaRehabExt'}, {name:'PediatricAtaxiaMetabolicExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricATExt', 'PediatricFAExt', 'PediatricSCAExt', 'PediatricMSAExt', 'PediatricCerebellarAtaxiaExt', 'PediatricSensoryAtaxiaExt', 'PediatricVestibularAtaxiaExt', 'PediatricAtaxiaGeneticExt', 'PediatricAtaxiaRehabExt', 'PediatricAtaxiaMetabolicExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;