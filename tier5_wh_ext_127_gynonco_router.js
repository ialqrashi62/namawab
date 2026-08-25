// filepath: tier5_wh_ext_127_gynonco_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wh_ext_127_gynonco_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().gyn_cancer_staging(req.body))));
router.post('/surgery', asyncH(async (req, res) => res.json(engine.funcs().surgery_plan(req.body))));
router.post('/chemo', asyncH(async (req, res) => res.json(engine.funcs().chemo(req.body))));
router.post('/radiation', asyncH(async (req, res) => res.json(engine.funcs().radiation(req.body))));
router.post('/survivorship', asyncH(async (req, res) => res.json(engine.funcs().survivorship(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().gynonco_fu(req.body))));
module.exports = router;
