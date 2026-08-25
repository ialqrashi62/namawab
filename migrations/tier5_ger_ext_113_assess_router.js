// filepath: tier5_ger_ext_113_assess_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ger_ext_113_assess_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/intake', asyncH(async (req, res) => res.json(engine.funcs().cga_intake(req.body))));
router.post('/adl', asyncH(async (req, res) => res.json(engine.funcs().adl_iadl(req.body))));
router.post('/cog', asyncH(async (req, res) => res.json(engine.funcs().cognitive(req.body))));
router.post('/mobility', asyncH(async (req, res) => res.json(engine.funcs().mobility(req.body))));
router.post('/nutrition', asyncH(async (req, res) => res.json(engine.funcs().nutrition(req.body))));
router.post('/summary', asyncH(async (req, res) => res.json(engine.funcs().cga_summary(req.body))));
module.exports = router;
