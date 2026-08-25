// filepath: tier5_wh_ext_130_preventive_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wh_ext_130_preventive_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/well', asyncH(async (req, res) => res.json(engine.funcs().well_woman(req.body))));
router.post('/breast', asyncH(async (req, res) => res.json(engine.funcs().breast_cancer_screen(req.body))));
router.post('/cervical', asyncH(async (req, res) => res.json(engine.funcs().cervical_screen(req.body))));
router.post('/bone', asyncH(async (req, res) => res.json(engine.funcs().bone_density(req.body))));
router.post('/cv', asyncH(async (req, res) => res.json(engine.funcs().cv_screen(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().preventive_fu(req.body))));
module.exports = router;
