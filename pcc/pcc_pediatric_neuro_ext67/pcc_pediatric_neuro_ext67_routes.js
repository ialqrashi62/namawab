// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pediatric_neuro_ext67';
const {PediatricTBIRehabExt, PediatricSCIRecoveryExt, PediatricStrokeRehabExt, PediatricBotoxExt, PediatricFESExt, PediatricPressureUlcerExt, PediatricNeuroBladderMgmtExt, PediatricWheelchairExt, PediatricNeuroAssistExt, PediatricOPRehabExt} = require('./pcc_pediatric_neuro_ext67_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricTBIRehabExt'}, {name:'PediatricSCIRecoveryExt'}, {name:'PediatricStrokeRehabExt'}, {name:'PediatricBotoxExt'}, {name:'PediatricFESExt'}, {name:'PediatricPressureUlcerExt'}, {name:'PediatricNeuroBladderMgmtExt'}, {name:'PediatricWheelchairExt'}, {name:'PediatricNeuroAssistExt'}, {name:'PediatricOPRehabExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricTBIRehabExt', 'PediatricSCIRecoveryExt', 'PediatricStrokeRehabExt', 'PediatricBotoxExt', 'PediatricFESExt', 'PediatricPressureUlcerExt', 'PediatricNeuroBladderMgmtExt', 'PediatricWheelchairExt', 'PediatricNeuroAssistExt', 'PediatricOPRehabExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;