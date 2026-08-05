// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_pediatric_surg_ext66';
const {PediatricSpinalFusionExt, PediatricGrowingRodExt, PediatricScoliosisSurgeryExt, PediatricMuscleBiopsyExt, PediatricTendonReleaseExt, PediatricGastrostomyExt, PediatricNissFundoplicationExt, PediatricTracheostomyExt, PediatricVPShuntExt, PediatricNusinersenDrugExt} = require('./pcc_pediatric_surg_ext66_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricSpinalFusionExt'}, {name:'PediatricGrowingRodExt'}, {name:'PediatricScoliosisSurgeryExt'}, {name:'PediatricMuscleBiopsyExt'}, {name:'PediatricTendonReleaseExt'}, {name:'PediatricGastrostomyExt'}, {name:'PediatricNissFundoplicationExt'}, {name:'PediatricTracheostomyExt'}, {name:'PediatricVPShuntExt'}, {name:'PediatricNusinersenDrugExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricSpinalFusionExt', 'PediatricGrowingRodExt', 'PediatricScoliosisSurgeryExt', 'PediatricMuscleBiopsyExt', 'PediatricTendonReleaseExt', 'PediatricGastrostomyExt', 'PediatricNissFundoplicationExt', 'PediatricTracheostomyExt', 'PediatricVPShuntExt', 'PediatricNusinersenDrugExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;