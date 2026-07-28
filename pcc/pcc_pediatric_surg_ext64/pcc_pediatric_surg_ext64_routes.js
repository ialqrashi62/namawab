// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricThymectomyExt, PediatricPlasmapheresisExt, PediatricIVIGExt, PediatricImmunoablativeTherapyExt, PediatricRituximabNMJExt, PediatricECulizumabExt, PediatricFcRNTreatmentExt, PediatricPlasmapheresisCathExt, PediatricNMJDietExt, PediatricSwallowingAssessExt} = require('./pcc_pediatric_surg_ext64_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricThymectomyExt'}, {name:'PediatricPlasmapheresisExt'}, {name:'PediatricIVIGExt'}, {name:'PediatricImmunoablativeTherapyExt'}, {name:'PediatricRituximabNMJExt'}, {name:'PediatricECulizumabExt'}, {name:'PediatricFcRNTreatmentExt'}, {name:'PediatricPlasmapheresisCathExt'}, {name:'PediatricNMJDietExt'}, {name:'PediatricSwallowingAssessExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricThymectomyExt', 'PediatricPlasmapheresisExt', 'PediatricIVIGExt', 'PediatricImmunoablativeTherapyExt', 'PediatricRituximabNMJExt', 'PediatricECulizumabExt', 'PediatricFcRNTreatmentExt', 'PediatricPlasmapheresisCathExt', 'PediatricNMJDietExt', 'PediatricSwallowingAssessExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;