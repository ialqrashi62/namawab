// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricPeripheralNeuropathyExt, PediatricCIDPExt, PediatricGuillainBarreExt, PediatricCIDPVariantExt, PediatricDiabeticNeuropathyExt, PediatricCMTExt, PediatricSmallFiberExt, PediatricAutonomicNeuropathyExt, PediatricHereditaryNeuropathyExt, PediatricVasculiticNeuropathyExt} = require('./pcc_pediatric_neuro_ext63_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricPeripheralNeuropathyExt'}, {name:'PediatricCIDPExt'}, {name:'PediatricGuillainBarreExt'}, {name:'PediatricCIDPVariantExt'}, {name:'PediatricDiabeticNeuropathyExt'}, {name:'PediatricCMTExt'}, {name:'PediatricSmallFiberExt'}, {name:'PediatricAutonomicNeuropathyExt'}, {name:'PediatricHereditaryNeuropathyExt'}, {name:'PediatricVasculiticNeuropathyExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricPeripheralNeuropathyExt', 'PediatricCIDPExt', 'PediatricGuillainBarreExt', 'PediatricCIDPVariantExt', 'PediatricDiabeticNeuropathyExt', 'PediatricCMTExt', 'PediatricSmallFiberExt', 'PediatricAutonomicNeuropathyExt', 'PediatricHereditaryNeuropathyExt', 'PediatricVasculiticNeuropathyExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;