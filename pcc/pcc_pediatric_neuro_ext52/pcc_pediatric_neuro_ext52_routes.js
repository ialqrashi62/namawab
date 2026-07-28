// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricIntracranialAtherosclerosisExt, PediatricCerebralMicrobleedsExt, PediatricSuperficialSiderosisExt, PediatricRadiationVasculopathyExt, PediatricPosteriorCorticalAtrophyExt, PediatricProgressiveAphasiaExt, PediatricCorticobasalDegenerationExt, PediatricProgressiveSupranuclearPalsyExt, PediatricMultipleSystemAtrophyExt, PediatricLewyBodyDementiaExt} = require('./pcc_pediatric_neuro_ext52_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:"PediatricIntracranialAtherosclerosisExt"}, {name:"PediatricCerebralMicrobleedsExt"}, {name:"PediatricSuperficialSiderosisExt"}, {name:"PediatricRadiationVasculopathyExt"}, {name:"PediatricPosteriorCorticalAtrophyExt"}, {name:"PediatricProgressiveAphasiaExt"}, {name:"PediatricCorticobasalDegenerationExt"}, {name:"PediatricProgressiveSupranuclearPalsyExt"}, {name:"PediatricMultipleSystemAtrophyExt"}, {name:"PediatricLewyBodyDementiaExt"}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; if(!fn.startsWith('pcc_pediatric_neuro_ext52_')) return res.status(400).json({error:'bad fn'}); const f=eval(fn); const r=f(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;