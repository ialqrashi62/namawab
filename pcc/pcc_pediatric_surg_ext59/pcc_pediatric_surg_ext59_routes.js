// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricThymectomyAutoimmuneExt, PediatricMSDiseaseModSurgeryExt, PediatricONSSurgeryExt, PediatricIntrathecalPumpExt, PediatricRehabDeviceExt, PediatricFunctionalElectricalStimExt, PediatricVRRehabExt, PediatricGaitTrainerSurgeryExt, PediatricPlasmaExchangeAccessExt, PediatricDMDImmunomodulatorExt} = require('./pcc_pediatric_surg_ext59_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricThymectomyAutoimmuneExt'}, {name:'PediatricMSDiseaseModSurgeryExt'}, {name:'PediatricONSSurgeryExt'}, {name:'PediatricIntrathecalPumpExt'}, {name:'PediatricRehabDeviceExt'}, {name:'PediatricFunctionalElectricalStimExt'}, {name:'PediatricVRRehabExt'}, {name:'PediatricGaitTrainerSurgeryExt'}, {name:'PediatricPlasmaExchangeAccessExt'}, {name:'PediatricDMDImmunomodulatorExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricThymectomyAutoimmuneExt', 'PediatricMSDiseaseModSurgeryExt', 'PediatricONSSurgeryExt', 'PediatricIntrathecalPumpExt', 'PediatricRehabDeviceExt', 'PediatricFunctionalElectricalStimExt', 'PediatricVRRehabExt', 'PediatricGaitTrainerSurgeryExt', 'PediatricPlasmaExchangeAccessExt', 'PediatricDMDImmunomodulatorExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;