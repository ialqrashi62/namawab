// Auto-generated routes
"use strict";
const express = require('express');
const {SpinalMuscularAtrophyExt, SBMAExt, FSHDExt, MyotonicDystrophyExt, LimbGirdleMuscularDystrophyExt, FacioscapulohumeralExt, InclusionBodyMyositisExt, DermatomyositisExt, PolymyositisExt, MyastheniaGravisMyopathyExt} = require('./pcc_neuro_ext77_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'SpinalMuscularAtrophyExt'}, {name:'SBMAExt'}, {name:'FSHDExt'}, {name:'MyotonicDystrophyExt'}, {name:'LimbGirdleMuscularDystrophyExt'}, {name:'FacioscapulohumeralExt'}, {name:'InclusionBodyMyositisExt'}, {name:'DermatomyositisExt'}, {name:'PolymyositisExt'}, {name:'MyastheniaGravisMyopathyExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['SpinalMuscularAtrophyExt', 'SBMAExt', 'FSHDExt', 'MyotonicDystrophyExt', 'LimbGirdleMuscularDystrophyExt', 'FacioscapulohumeralExt', 'InclusionBodyMyositisExt', 'DermatomyositisExt', 'PolymyositisExt', 'MyastheniaGravisMyopathyExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;