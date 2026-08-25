// filepath: tier5_ger_ext_116_polypharm_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ger_ext_116_polypharm_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/brown_bag', asyncH(async (req, res) => res.json(engine.funcs().brown_bag(req.body))));
router.post('/beers', asyncH(async (req, res) => res.json(engine.funcs().beers(req.body))));
router.post('/deprescribing', asyncH(async (req, res) => res.json(engine.funcs().deprescribing(req.body))));
router.post('/renal', asyncH(async (req, res) => res.json(engine.funcs().renal_dose(req.body))));
router.post('/adherence', asyncH(async (req, res) => res.json(engine.funcs().adherence_tool(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().pharm_review_fu(req.body))));
module.exports = router;
