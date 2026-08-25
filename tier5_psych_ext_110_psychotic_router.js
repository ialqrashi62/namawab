// filepath: tier5_psych_ext_110_psychotic_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_110_psychotic_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/first_episode', asyncH(async (req, res) => res.json(engine.funcs().first_psychosis(req.body))));
router.post('/init', asyncH(async (req, res) => res.json(engine.funcs().antipsychotic_init(req.body))));
router.post('/metabolic', asyncH(async (req, res) => res.json(engine.funcs().metabolic_monitoring(req.body))));
router.post('/clozapine', asyncH(async (req, res) => res.json(engine.funcs().clozapine(req.body))));
router.post('/adherence', asyncH(async (req, res) => res.json(engine.funcs().adherence(req.body))));
router.post('/recovery', asyncH(async (req, res) => res.json(engine.funcs().psych_recovery(req.body))));
module.exports = router;
