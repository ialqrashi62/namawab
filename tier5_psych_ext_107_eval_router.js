// filepath: tier5_psych_ext_107_eval_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_107_eval_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/intake', asyncH(async (req, res) => res.json(engine.funcs().intake(req.body))));
router.post('/history', asyncH(async (req, res) => res.json(engine.funcs().history(req.body))));
router.post('/mse', asyncH(async (req, res) => res.json(engine.funcs().mse(req.body))));
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().risk(req.body))));
router.post('/diagnosis', asyncH(async (req, res) => res.json(engine.funcs().diagnosis(req.body))));
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().treatment_plan(req.body))));
module.exports = router;
