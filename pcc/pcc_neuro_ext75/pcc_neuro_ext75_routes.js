// Auto-generated routes
"use strict";
const express = require('express');
const {MyastheniaGravisExt, LambertEatonExt, MyasthenicCrisisExt, CholinergicCrisisExt, OcularMyastheniaExt, ThymomaAssociatedExt, MUSKAntibodyMGExt, LRP4MGExt, SeronegativeMGExt, MGQOL15Ext} = require('./pcc_neuro_ext75_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'MyastheniaGravisExt'}, {name:'LambertEatonExt'}, {name:'MyasthenicCrisisExt'}, {name:'CholinergicCrisisExt'}, {name:'OcularMyastheniaExt'}, {name:'ThymomaAssociatedExt'}, {name:'MUSKAntibodyMGExt'}, {name:'LRP4MGExt'}, {name:'SeronegativeMGExt'}, {name:'MGQOL15Ext'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['MyastheniaGravisExt', 'LambertEatonExt', 'MyasthenicCrisisExt', 'CholinergicCrisisExt', 'OcularMyastheniaExt', 'ThymomaAssociatedExt', 'MUSKAntibodyMGExt', 'LRP4MGExt', 'SeronegativeMGExt', 'MGQOL15Ext']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;