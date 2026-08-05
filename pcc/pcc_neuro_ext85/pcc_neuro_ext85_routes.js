// Auto-generated routes
"use strict";
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_neuro_ext85';
const {SleepDisorderExt, ObstructiveSleepApneaExt, CentralSleepApneaExt, NarcolepsyAssessmentExt, RestlessLegsExt, REMBehaviorDisorderExt, CircadianDisorderExt, CPAPTherapyExt, SleepStudyExt, SleepHygieneExt} = require('./pcc_neuro_ext85_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'SleepDisorderExt'}, {name:'ObstructiveSleepApneaExt'}, {name:'CentralSleepApneaExt'}, {name:'NarcolepsyAssessmentExt'}, {name:'RestlessLegsExt'}, {name:'REMBehaviorDisorderExt'}, {name:'CircadianDisorderExt'}, {name:'CPAPTherapyExt'}, {name:'SleepStudyExt'}, {name:'SleepHygieneExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['SleepDisorderExt', 'ObstructiveSleepApneaExt', 'CentralSleepApneaExt', 'NarcolepsyAssessmentExt', 'RestlessLegsExt', 'REMBehaviorDisorderExt', 'CircadianDisorderExt', 'CPAPTherapyExt', 'SleepStudyExt', 'SleepHygieneExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });
 db.push(req.body); res.json({ok:true, recorded:true, n:db.length, tenant_id: tenant_id || null, decisionId: decisionId || null}); });
module.exports = router;