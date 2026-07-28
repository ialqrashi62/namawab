// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricBrainTumorStagingExt, PediatricGliomaMolecularExt, PediatricMedulloblastomaExt, PediatricEpendymomaExt, PediatricATRTClassificationExt, PediatricDNETExt, PediatricCraniopharyngiomaExt, PediatricPinealtumorExt, PediatricBrainstemGliomaExt, PediatricNeuroOncFollowupExt} = require('./pcc_pediatric_neuro_ext55_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricBrainTumorStagingExt'}, {name:'PediatricGliomaMolecularExt'}, {name:'PediatricMedulloblastomaExt'}, {name:'PediatricEpendymomaExt'}, {name:'PediatricATRTClassificationExt'}, {name:'PediatricDNETExt'}, {name:'PediatricCraniopharyngiomaExt'}, {name:'PediatricPinealtumorExt'}, {name:'PediatricBrainstemGliomaExt'}, {name:'PediatricNeuroOncFollowupExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricBrainTumorStagingExt', 'PediatricGliomaMolecularExt', 'PediatricMedulloblastomaExt', 'PediatricEpendymomaExt', 'PediatricATRTClassificationExt', 'PediatricDNETExt', 'PediatricCraniopharyngiomaExt', 'PediatricPinealtumorExt', 'PediatricBrainstemGliomaExt', 'PediatricNeuroOncFollowupExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;