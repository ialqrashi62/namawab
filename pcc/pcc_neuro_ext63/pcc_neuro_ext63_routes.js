// Auto-generated routes
"use strict";
const express = require('express');
const {IntracranialAtherosclerosisDiseaseExt, CerebralMicrobleedsSyndromeExt, SuperficialSiderosisExt, RadiationVasculopathyExt, PosteriorCorticalAtrophyExt, PrimaryProgressiveAphasiaExt, CorticobasalDegenerationExt, ProgressiveSupranuclearPalsyExt, MultipleSystemAtrophyExt, LewyBodyDementiaExt} = require('./pcc_neuro_ext63_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:"IntracranialAtherosclerosisDiseaseExt"}, {name:"CerebralMicrobleedsSyndromeExt"}, {name:"SuperficialSiderosisExt"}, {name:"RadiationVasculopathyExt"}, {name:"PosteriorCorticalAtrophyExt"}, {name:"PrimaryProgressiveAphasiaExt"}, {name:"CorticobasalDegenerationExt"}, {name:"ProgressiveSupranuclearPalsyExt"}, {name:"MultipleSystemAtrophyExt"}, {name:"LewyBodyDementiaExt"}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; if(!fn.startsWith('pcc_neuro_ext63_')) return res.status(400).json({error:'bad fn'}); const f=eval(fn); const r=f(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;