// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricIIHFollowupExt, PediatricVenousSinusStentExt, PediatricCSFLeakMonitorExt, PediatricIntracranialHypotensionExt, PediatricChiariAssessmentExt, PediatricSyringomyeliaFollowExt, PediatricBasilarInvaginationExt, PediatricCVJAnomalyExt, PediatricCSFFlowDynamicsExt, PediatricEmptySellaMonitorExt} = require('./pcc_pediatric_neuro_ext53_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricIIHFollowupExt'}, {name:'PediatricVenousSinusStentExt'}, {name:'PediatricCSFLeakMonitorExt'}, {name:'PediatricIntracranialHypotensionExt'}, {name:'PediatricChiariAssessmentExt'}, {name:'PediatricSyringomyeliaFollowExt'}, {name:'PediatricBasilarInvaginationExt'}, {name:'PediatricCVJAnomalyExt'}, {name:'PediatricCSFFlowDynamicsExt'}, {name:'PediatricEmptySellaMonitorExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricIIHFollowupExt', 'PediatricVenousSinusStentExt', 'PediatricCSFLeakMonitorExt', 'PediatricIntracranialHypotensionExt', 'PediatricChiariAssessmentExt', 'PediatricSyringomyeliaFollowExt', 'PediatricBasilarInvaginationExt', 'PediatricCVJAnomalyExt', 'PediatricCSFFlowDynamicsExt', 'PediatricEmptySellaMonitorExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;