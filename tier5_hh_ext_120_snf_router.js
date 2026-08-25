// filepath: tier5_hh_ext_120_snf_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_hh_ext_120_snf_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/transition', asyncH(async (req, res) => res.json(engine.funcs().transition(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().med_rec(req.body))));
router.post('/visit', asyncH(async (req, res) => res.json(engine.funcs().visit_summary(req.body))));
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().readmit_risk(req.body))));
router.post('/rehab', asyncH(async (req, res) => res.json(engine.funcs().rehab_skilled(req.body))));
router.post('/close', asyncH(async (req, res) => res.json(engine.funcs().episode_close(req.body))));
module.exports = router;
