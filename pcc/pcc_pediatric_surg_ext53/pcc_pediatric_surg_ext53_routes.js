// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricVenousSinusStentSurgeryExt, PediatricVPShuntTapTestExt, PediatricChiariDecompressionExt, PediatricSyrinxShuntExt, PediatricBasilarInvaginationSurgeryExt, PediatricOccipitalCervicalFusionExt, PediatricVPShuntPlacementExt, PediatricEndoscopicThirdVentriculostomyExt, PediatricCSFDiversionExt, PediatricEndoscopicFenestrationExt} = require('./pcc_pediatric_surg_ext53_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricVenousSinusStentSurgeryExt'}, {name:'PediatricVPShuntTapTestExt'}, {name:'PediatricChiariDecompressionExt'}, {name:'PediatricSyrinxShuntExt'}, {name:'PediatricBasilarInvaginationSurgeryExt'}, {name:'PediatricOccipitalCervicalFusionExt'}, {name:'PediatricVPShuntPlacementExt'}, {name:'PediatricEndoscopicThirdVentriculostomyExt'}, {name:'PediatricCSFDiversionExt'}, {name:'PediatricEndoscopicFenestrationExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricVenousSinusStentSurgeryExt', 'PediatricVPShuntTapTestExt', 'PediatricChiariDecompressionExt', 'PediatricSyrinxShuntExt', 'PediatricBasilarInvaginationSurgeryExt', 'PediatricOccipitalCervicalFusionExt', 'PediatricVPShuntPlacementExt', 'PediatricEndoscopicThirdVentriculostomyExt', 'PediatricCSFDiversionExt', 'PediatricEndoscopicFenestrationExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;