// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricMSExt, PediatricMSRelapseExt, PediatricMSProgressionExt, PediatricDMTManagementExt, PediatricNMOSDExt, PediatricMOGAntibodyExt, PediatricADEMExt, PediatricOpticNeuritisExt, PediatricTransverseMyelitisExt, PediatricMSRehabExt} = require('./pcc_pediatric_neuro_ext59_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricMSExt'}, {name:'PediatricMSRelapseExt'}, {name:'PediatricMSProgressionExt'}, {name:'PediatricDMTManagementExt'}, {name:'PediatricNMOSDExt'}, {name:'PediatricMOGAntibodyExt'}, {name:'PediatricADEMExt'}, {name:'PediatricOpticNeuritisExt'}, {name:'PediatricTransverseMyelitisExt'}, {name:'PediatricMSRehabExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricMSExt', 'PediatricMSRelapseExt', 'PediatricMSProgressionExt', 'PediatricDMTManagementExt', 'PediatricNMOSDExt', 'PediatricMOGAntibodyExt', 'PediatricADEMExt', 'PediatricOpticNeuritisExt', 'PediatricTransverseMyelitisExt', 'PediatricMSRehabExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;