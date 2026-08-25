// filepath: tier5_psych_ext_112_therapy_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_112_therapy_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/cbt', asyncH(async (req, res) => res.json(engine.funcs().cbt(req.body))));
router.post('/emdr', asyncH(async (req, res) => res.json(engine.funcs().emdr(req.body))));
router.post('/dbt', asyncH(async (req, res) => res.json(engine.funcs().dbt(req.body))));
router.post('/mi', asyncH(async (req, res) => res.json(engine.funcs().mi(req.body))));
router.post('/family', asyncH(async (req, res) => res.json(engine.funcs().family(req.body))));
router.post('/group', asyncH(async (req, res) => res.json(engine.funcs().group(req.body))));
module.exports = router;
