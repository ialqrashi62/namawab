// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricSialorrheaExt, PediatricSpasticityOralExt, PediatricDysarthriaExt, PediatricDysphagiaExt, PediatricPEGExt, PediatricTracheostomyDecannExt, PediatricRespAssessmentExt, PediatricVentMgmtExt, PediatricSleepApneaExt, PediatricGIAssessmentExt} = require('./pcc_pediatric_neuro_ext75_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricSialorrheaExt'}, {name:'PediatricSpasticityOralExt'}, {name:'PediatricDysarthriaExt'}, {name:'PediatricDysphagiaExt'}, {name:'PediatricPEGExt'}, {name:'PediatricTracheostomyDecannExt'}, {name:'PediatricRespAssessmentExt'}, {name:'PediatricVentMgmtExt'}, {name:'PediatricSleepApneaExt'}, {name:'PediatricGIAssessmentExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricSialorrheaExt', 'PediatricSpasticityOralExt', 'PediatricDysarthriaExt', 'PediatricDysphagiaExt', 'PediatricPEGExt', 'PediatricTracheostomyDecannExt', 'PediatricRespAssessmentExt', 'PediatricVentMgmtExt', 'PediatricSleepApneaExt', 'PediatricGIAssessmentExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;