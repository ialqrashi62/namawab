// filepath: tier5_psych_ext_109_anxiety_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_109_anxiety_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/gad', asyncH(async (req, res) => res.json(engine.funcs().gad_screen(req.body))));
router.post('/panic', asyncH(async (req, res) => res.json(engine.funcs().panic(req.body))));
router.post('/ocd', asyncH(async (req, res) => res.json(engine.funcs().ocd(req.body))));
router.post('/ptsd', asyncH(async (req, res) => res.json(engine.funcs().ptsd(req.body))));
router.post('/social', asyncH(async (req, res) => res.json(engine.funcs().social(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().anxiety_fu(req.body))));
module.exports = router;
