// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pediatric_neuro_ext68';
const {PediatricObstructiveHydroExt, PediatricCommunicatingHydroExt, PediatricNPHExt, PediatricProgrammableValveExt, PediatricETVExt, PediatricCPCExt, PediatricShuntTapExt, PediatricHydroCognitiveExt, PediatricHydroRehabExt, PediatricHydroBiomarkerExt} = require('./pcc_pediatric_neuro_ext68_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricObstructiveHydroExt'}, {name:'PediatricCommunicatingHydroExt'}, {name:'PediatricNPHExt'}, {name:'PediatricProgrammableValveExt'}, {name:'PediatricETVExt'}, {name:'PediatricCPCExt'}, {name:'PediatricShuntTapExt'}, {name:'PediatricHydroCognitiveExt'}, {name:'PediatricHydroRehabExt'}, {name:'PediatricHydroBiomarkerExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricObstructiveHydroExt', 'PediatricCommunicatingHydroExt', 'PediatricNPHExt', 'PediatricProgrammableValveExt', 'PediatricETVExt', 'PediatricCPCExt', 'PediatricShuntTapExt', 'PediatricHydroCognitiveExt', 'PediatricHydroRehabExt', 'PediatricHydroBiomarkerExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;