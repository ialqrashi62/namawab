// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext63';
const {IntracranialAtherosclerosisDiseaseExt, CerebralMicrobleedsSyndromeExt, SuperficialSiderosisExt, RadiationVasculopathyExt, PosteriorCorticalAtrophyExt, PrimaryProgressiveAphasiaExt, CorticobasalDegenerationExt, ProgressiveSupranuclearPalsyExt, MultipleSystemAtrophyExt, LewyBodyDementiaExt} = require('./pcc_neuro_ext63_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:"IntracranialAtherosclerosisDiseaseExt"}, {name:"CerebralMicrobleedsSyndromeExt"}, {name:"SuperficialSiderosisExt"}, {name:"RadiationVasculopathyExt"}, {name:"PosteriorCorticalAtrophyExt"}, {name:"PrimaryProgressiveAphasiaExt"}, {name:"CorticobasalDegenerationExt"}, {name:"ProgressiveSupranuclearPalsyExt"}, {name:"MultipleSystemAtrophyExt"}, {name:"LewyBodyDementiaExt"}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; if(!fn.startsWith('pcc_neuro_ext63_')) return res.status(400).json({error:'bad fn'}); const f=eval(fn); const r=f(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;