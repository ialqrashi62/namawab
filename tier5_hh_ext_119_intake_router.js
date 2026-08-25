// filepath: tier5_hh_ext_119_intake_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_hh_ext_119_intake_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/eligibility', asyncH(async (req, res) => res.json(engine.funcs().eligibility(req.body))));
router.post('/oasis', asyncH(async (req, res) => res.json(engine.funcs().oasis_intake(req.body))));
router.post('/soc', asyncH(async (req, res) => res.json(engine.funcs().soc(req.body))));
router.post('/oasis30', asyncH(async (req, res) => res.json(engine.funcs().oasis_30day(req.body))));
router.post('/verify', asyncH(async (req, res) => res.json(engine.funcs().verify_visit(req.body))));
router.post('/discharge', asyncH(async (req, res) => res.json(engine.funcs().discharge_planning(req.body))));
module.exports = router;
