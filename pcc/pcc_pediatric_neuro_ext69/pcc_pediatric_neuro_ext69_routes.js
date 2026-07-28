// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricNMOExt, PediatricMOGDEMExt, PediatricADEMSpectrumExt, PediatricMyelitisOpticaExt, PediatricMSVariantsExt, PediatricRISExt, PediatricCISExt, PediatricMSTreatmentRespExt, PediatricMSRelapseMgmtExt, PediatricMSMonitoringExt} = require('./pcc_pediatric_neuro_ext69_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricNMOExt'}, {name:'PediatricMOGDEMExt'}, {name:'PediatricADEMSpectrumExt'}, {name:'PediatricMyelitisOpticaExt'}, {name:'PediatricMSVariantsExt'}, {name:'PediatricRISExt'}, {name:'PediatricCISExt'}, {name:'PediatricMSTreatmentRespExt'}, {name:'PediatricMSRelapseMgmtExt'}, {name:'PediatricMSMonitoringExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricNMOExt', 'PediatricMOGDEMExt', 'PediatricADEMSpectrumExt', 'PediatricMyelitisOpticaExt', 'PediatricMSVariantsExt', 'PediatricRISExt', 'PediatricCISExt', 'PediatricMSTreatmentRespExt', 'PediatricMSRelapseMgmtExt', 'PediatricMSMonitoringExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;