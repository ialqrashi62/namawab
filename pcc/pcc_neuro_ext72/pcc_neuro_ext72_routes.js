// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext72';
const {CNSInfectionExt, EncephalitisManagementExt, MeningitisAssessmentExt, BrainAbscessExt, SpinalEpiduralAbscessExt, CerebritisExt, PostInfectiousEncephalitisExt, RASMeningitisExt, TuberculousMeningitisExt, FungalMeningitisExt} = require('./pcc_neuro_ext72_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'CNSInfectionExt'}, {name:'EncephalitisManagementExt'}, {name:'MeningitisAssessmentExt'}, {name:'BrainAbscessExt'}, {name:'SpinalEpiduralAbscessExt'}, {name:'CerebritisExt'}, {name:'PostInfectiousEncephalitisExt'}, {name:'RASMeningitisExt'}, {name:'TuberculousMeningitisExt'}, {name:'FungalMeningitisExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['CNSInfectionExt', 'EncephalitisManagementExt', 'MeningitisAssessmentExt', 'BrainAbscessExt', 'SpinalEpiduralAbscessExt', 'CerebritisExt', 'PostInfectiousEncephalitisExt', 'RASMeningitisExt', 'TuberculousMeningitisExt', 'FungalMeningitisExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;