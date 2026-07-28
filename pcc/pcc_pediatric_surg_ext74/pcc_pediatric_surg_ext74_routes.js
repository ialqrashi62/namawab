// Auto-generated routes
"use strict";
const express = require('express');
const {PediatricTonsillectomyExt, PediatricAdenoidectomyExt, PediatricUvulopalatoplastyExt, PediatricCPAPInitExt, PediatricBiPAPInitExt, PediatricCPAPFollowExt, PediatricCranialRemodelingExt, PediatricPharyngoplastyExt, PediatricMaxillaryMandibularExt, PediatricTracheostomyExt} = require('./pcc_pediatric_surg_ext74_engine');
const router = express.Router();
const db = [];
function authenticate(req,res,next){return next();}
router.get('/list', authenticate, (req,res)=>{ res.json([{name:'PediatricTonsillectomyExt'}, {name:'PediatricAdenoidectomyExt'}, {name:'PediatricUvulopalatoplastyExt'}, {name:'PediatricCPAPInitExt'}, {name:'PediatricBiPAPInitExt'}, {name:'PediatricCPAPFollowExt'}, {name:'PediatricCranialRemodelingExt'}, {name:'PediatricPharyngoplastyExt'}, {name:'PediatricMaxillaryMandibularExt'}, {name:'PediatricTracheostomyExt'}]); });
router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; const allow=['PediatricTonsillectomyExt', 'PediatricAdenoidectomyExt', 'PediatricUvulopalatoplastyExt', 'PediatricCPAPInitExt', 'PediatricBiPAPInitExt', 'PediatricCPAPFollowExt', 'PediatricCranialRemodelingExt', 'PediatricPharyngoplastyExt', 'PediatricMaxillaryMandibularExt', 'PediatricTracheostomyExt']; if(!allow.includes(fn)) return res.status(400).json({error:'bad fn'}); const r=eval(fn)(req.body||{}); res.json(r); });
router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });
module.exports = router;