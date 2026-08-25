// filepath: tier5_hh_ext_124_adl_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_hh_ext_124_adl_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().adl_plan(req.body))));
router.post('/visit', asyncH(async (req, res) => res.json(engine.funcs().adl_visit(req.body))));
router.post('/burden', asyncH(async (req, res) => res.json(engine.funcs().caregiver_burden(req.body))));
router.post('/safety', asyncH(async (req, res) => res.json(engine.funcs().safety_check(req.body))));
router.post('/rcf', asyncH(async (req, res) => res.json(engine.funcs().rcf(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().adl_fu(req.body))));
module.exports = router;
