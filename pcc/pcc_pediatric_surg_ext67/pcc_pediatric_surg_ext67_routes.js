// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricToneMgmtExt, PediatricIntrathecalPumpExt, PediatricSDRExt, PediatricBotulinumSurgExt, PediatricConstraintTherapyExt, PediatricGaitTrainingExt, PediatricPROExt, PediatricOrthoticCastingExt, PediatricOrthoScoliosisMgmtExt, PediatricOrthosisGaitExt} = require('./pcc_pediatric_surg_ext67_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricToneMgmtExt'}, {name:'PediatricIntrathecalPumpExt'}, {name:'PediatricSDRExt'}, {name:'PediatricBotulinumSurgExt'}, {name:'PediatricConstraintTherapyExt'}, {name:'PediatricGaitTrainingExt'}, {name:'PediatricPROExt'}, {name:'PediatricOrthoticCastingExt'}, {name:'PediatricOrthoScoliosisMgmtExt'}, {name:'PediatricOrthosisGaitExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricToneMgmtExt', 'PediatricIntrathecalPumpExt', 'PediatricSDRExt', 'PediatricBotulinumSurgExt', 'PediatricConstraintTherapyExt', 'PediatricGaitTrainingExt', 'PediatricPROExt', 'PediatricOrthoticCastingExt', 'PediatricOrthoScoliosisMgmtExt', 'PediatricOrthosisGaitExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;