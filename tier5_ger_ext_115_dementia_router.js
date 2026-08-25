// filepath: tier5_ger_ext_115_dementia_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ger_ext_115_dementia_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/workup', asyncH(async (req, res) => res.json(engine.funcs().workup(req.body))));
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().stages(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().medications(req.body))));
router.post('/safety', asyncH(async (req, res) => res.json(engine.funcs().safety(req.body))));
router.post('/bpsd', asyncH(async (req, res) => res.json(engine.funcs().bpsd(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().dementia_fu(req.body))));
module.exports = router;
