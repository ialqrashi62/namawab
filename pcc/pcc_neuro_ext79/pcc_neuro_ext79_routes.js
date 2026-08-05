// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext79';
const {ObstructiveHydrocephalusExt, CommunicatingHydrocephalusExt, NormalPressureHydrocephalusExt, HydrocephalusProgrammableValveExt, EndoscopicThirdVentriculostomyExt, ChoroidPlexusCauterizationExt, HydrocephalusShuntTapExt, HydrocephalusCognitiveExt, HydrocephalusRehabExt, HydrocephalusBiochemicalExt} = require('./pcc_neuro_ext79_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'ObstructiveHydrocephalusExt'}, {name:'CommunicatingHydrocephalusExt'}, {name:'NormalPressureHydrocephalusExt'}, {name:'HydrocephalusProgrammableValveExt'}, {name:'EndoscopicThirdVentriculostomyExt'}, {name:'ChoroidPlexusCauterizationExt'}, {name:'HydrocephalusShuntTapExt'}, {name:'HydrocephalusCognitiveExt'}, {name:'HydrocephalusRehabExt'}, {name:'HydrocephalusBiochemicalExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['ObstructiveHydrocephalusExt', 'CommunicatingHydrocephalusExt', 'NormalPressureHydrocephalusExt', 'HydrocephalusProgrammableValveExt', 'EndoscopicThirdVentriculostomyExt', 'ChoroidPlexusCauterizationExt', 'HydrocephalusShuntTapExt', 'HydrocephalusCognitiveExt', 'HydrocephalusRehabExt', 'HydrocephalusBiochemicalExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;