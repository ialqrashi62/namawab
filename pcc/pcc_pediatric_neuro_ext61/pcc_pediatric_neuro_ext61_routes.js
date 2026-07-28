// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricCNSInfectionExt, PediatricEncephalitisExt, PediatricMeningitisExt, PediatricBrainAbscessExt, PediatricSpinalEpiduralAbscessExt, PediatricCerebritisExt, PediatricPostInfectiousExt, PediatricRASMeningitisExt, PediatricTBMExt, PediatricFungalMeningitisExt} = require('./pcc_pediatric_neuro_ext61_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricCNSInfectionExt'}, {name:'PediatricEncephalitisExt'}, {name:'PediatricMeningitisExt'}, {name:'PediatricBrainAbscessExt'}, {name:'PediatricSpinalEpiduralAbscessExt'}, {name:'PediatricCerebritisExt'}, {name:'PediatricPostInfectiousExt'}, {name:'PediatricRASMeningitisExt'}, {name:'PediatricTBMExt'}, {name:'PediatricFungalMeningitisExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricCNSInfectionExt', 'PediatricEncephalitisExt', 'PediatricMeningitisExt', 'PediatricBrainAbscessExt', 'PediatricSpinalEpiduralAbscessExt', 'PediatricCerebritisExt', 'PediatricPostInfectiousExt', 'PediatricRASMeningitisExt', 'PediatricTBMExt', 'PediatricFungalMeningitisExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;