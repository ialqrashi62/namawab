// filepath: tier5_wh_ext_128_repro_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wh_ext_128_repro_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/workup', asyncH(async (req, res) => res.json(engine.funcs().infertility_workup(req.body))));
router.post('/cycle', asyncH(async (req, res) => res.json(engine.funcs().ivf_cycle(req.body))));
router.post('/embryo', asyncH(async (req, res) => res.json(engine.funcs().embryology(req.body))));
router.post('/transfer', asyncH(async (req, res) => res.json(engine.funcs().transfer(req.body))));
router.post('/ivf_fu', asyncH(async (req, res) => res.json(engine.funcs().ivf_fu(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().repro_fu(req.body))));
module.exports = router;
