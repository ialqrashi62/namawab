// filepath: tier5_hh_ext_123_palliative_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_hh_ext_123_palliative_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/consult', asyncH(async (req, res) => res.json(engine.funcs().consult(req.body))));
router.post('/pain', asyncH(async (req, res) => res.json(engine.funcs().pain(req.body))));
router.post('/goals', asyncH(async (req, res) => res.json(engine.funcs().goals(req.body))));
router.post('/symptom', asyncH(async (req, res) => res.json(engine.funcs().symp_nonpain(req.body))));
router.post('/coord', asyncH(async (req, res) => res.json(engine.funcs().care_coordination(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().palliative_fu(req.body))));
module.exports = router;
