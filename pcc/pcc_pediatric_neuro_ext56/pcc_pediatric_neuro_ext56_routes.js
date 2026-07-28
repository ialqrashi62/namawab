// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricStrokeRecoveryExt, PediatricAphasiaExt, PediatricDysphagiaExt, PediatricSpasticityExt, PediatricNeurogenicBladderExt, PediatricPoststrokeDepressionExt, PediatricPoststrokeSeizureExt, PediatricMotorRecoveryExt, PediatricCogRehabExt, PediatricSchoolReintegrationExt} = require('./pcc_pediatric_neuro_ext56_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricStrokeRecoveryExt'}, {name:'PediatricAphasiaExt'}, {name:'PediatricDysphagiaExt'}, {name:'PediatricSpasticityExt'}, {name:'PediatricNeurogenicBladderExt'}, {name:'PediatricPoststrokeDepressionExt'}, {name:'PediatricPoststrokeSeizureExt'}, {name:'PediatricMotorRecoveryExt'}, {name:'PediatricCogRehabExt'}, {name:'PediatricSchoolReintegrationExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricStrokeRecoveryExt', 'PediatricAphasiaExt', 'PediatricDysphagiaExt', 'PediatricSpasticityExt', 'PediatricNeurogenicBladderExt', 'PediatricPoststrokeDepressionExt', 'PediatricPoststrokeSeizureExt', 'PediatricMotorRecoveryExt', 'PediatricCogRehabExt', 'PediatricSchoolReintegrationExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;