// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricVPShuntInfectionRevExt, PediatricEVDPlacementExt, PediatricCraniotomyForAbscessExt, PediatricSepticEmpyemaExt, PediatricSpinalDrainExt, PediatricLPForMeningitisExt, PediatricVPShuntExternalizationExt, PediatricVentriculitisTreatmentExt, PediatricSubduralEmpyemaExt, PediatricCNSInfectionRecoverSurgExt} = require('./pcc_pediatric_surg_ext61_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricVPShuntInfectionRevExt'}, {name:'PediatricEVDPlacementExt'}, {name:'PediatricCraniotomyForAbscessExt'}, {name:'PediatricSepticEmpyemaExt'}, {name:'PediatricSpinalDrainExt'}, {name:'PediatricLPForMeningitisExt'}, {name:'PediatricVPShuntExternalizationExt'}, {name:'PediatricVentriculitisTreatmentExt'}, {name:'PediatricSubduralEmpyemaExt'}, {name:'PediatricCNSInfectionRecoverSurgExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricVPShuntInfectionRevExt', 'PediatricEVDPlacementExt', 'PediatricCraniotomyForAbscessExt', 'PediatricSepticEmpyemaExt', 'PediatricSpinalDrainExt', 'PediatricLPForMeningitisExt', 'PediatricVPShuntExternalizationExt', 'PediatricVentriculitisTreatmentExt', 'PediatricSubduralEmpyemaExt', 'PediatricCNSInfectionRecoverSurgExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;