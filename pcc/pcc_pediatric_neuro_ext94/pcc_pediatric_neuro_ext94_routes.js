// filepath: pcc/pcc_pediatric_neuro_ext94/pcc_pediatric_neuro_ext94_routes.js
const express=require('express');const {functions:F}=require('./pcc_pediatric_neuro_ext94_engine');const {authenticate}=require('../middleware');const router=express.Router();
router.get('/list',(_req,res)=>res.json({module:'pcc_pediatric_neuro_ext94',version:'v3.204.0',functions:Object.keys(F)}));
router.post('/call/:fn',(req,res)=>{const fn=req.params.fn;if(!F[fn])return res.status(404).json({error:'not found'});const r=F[fn](req.body||{});res.json(r);});
router.post('/record',(req,res)=>{const {fn,payload,decisionId}=req.body||{};if(!F[fn])return res.status(404).json({error:'not found'});const r=F[fn](payload||{});res.json({decisionId,...r});});
module.exports=router;
