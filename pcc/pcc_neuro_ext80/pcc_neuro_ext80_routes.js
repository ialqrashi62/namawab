// Auto-generated routes
"use strict";
const express = require('express');
const {NMOExt, MOGDEMExt, ADEMSpectrumExt, MyelitisOpticaExt, MSVariantsExt, RadiologicallyIsolatedExt, ClinicallyIsolatedSynExt, MSTreatmentResponseExt, MSRelapseMgmtExt, MSMonitoringExt} = require('./pcc_neuro_ext80_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'NMOExt'}, {name:'MOGDEMExt'}, {name:'ADEMSpectrumExt'}, {name:'MyelitisOpticaExt'}, {name:'MSVariantsExt'}, {name:'RadiologicallyIsolatedExt'}, {name:'ClinicallyIsolatedSynExt'}, {name:'MSTreatmentResponseExt'}, {name:'MSRelapseMgmtExt'}, {name:'MSMonitoringExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['NMOExt', 'MOGDEMExt', 'ADEMSpectrumExt', 'MyelitisOpticaExt', 'MSVariantsExt', 'RadiologicallyIsolatedExt', 'ClinicallyIsolatedSynExt', 'MSTreatmentResponseExt', 'MSRelapseMgmtExt', 'MSMonitoringExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;