// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricParkinsonExt, PediatricJPExt, PediatricDystoniaExt, PediatricHuntingtonExt, PediatricWilsonExt, PediatricLeschNyhanExt, PediatricNeurotransmitterExt, PediatricAicardiExt, PediatricRettSyndromeExt, PediatricTouretteExt} = require('./pcc_pediatric_neuro_ext70_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricParkinsonExt'}, {name:'PediatricJPExt'}, {name:'PediatricDystoniaExt'}, {name:'PediatricHuntingtonExt'}, {name:'PediatricWilsonExt'}, {name:'PediatricLeschNyhanExt'}, {name:'PediatricNeurotransmitterExt'}, {name:'PediatricAicardiExt'}, {name:'PediatricRettSyndromeExt'}, {name:'PediatricTouretteExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricParkinsonExt', 'PediatricJPExt', 'PediatricDystoniaExt', 'PediatricHuntingtonExt', 'PediatricWilsonExt', 'PediatricLeschNyhanExt', 'PediatricNeurotransmitterExt', 'PediatricAicardiExt', 'PediatricRettSyndromeExt', 'PediatricTouretteExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;