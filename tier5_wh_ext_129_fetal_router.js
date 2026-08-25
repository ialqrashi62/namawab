// filepath: tier5_wh_ext_129_fetal_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wh_ext_129_fetal_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/first_tri', asyncH(async (req, res) => res.json(engine.funcs().first_trimester(req.body))));
router.post('/anatomy', asyncH(async (req, res) => res.json(engine.funcs().anatomy_scan(req.body))));
router.post('/invasive', asyncH(async (req, res) => res.json(engine.funcs().amnio_cvs(req.body))));
router.post('/counsel', asyncH(async (req, res) => res.json(engine.funcs().genetic_counsel(req.body))));
router.post('/anomalies', asyncH(async (req, res) => res.json(engine.funcs().anomalies(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().fetal_fu(req.body))));
module.exports = router;
