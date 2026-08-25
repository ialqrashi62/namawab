// filepath: tier5_psych_ext_108_mood_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_108_mood_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/depression', asyncH(async (req, res) => res.json(engine.funcs().depression_screen(req.body))));
router.post('/bipolar', asyncH(async (req, res) => res.json(engine.funcs().bipolar_screen(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().med_selection(req.body))));
router.post('/lithium', asyncH(async (req, res) => res.json(engine.funcs().lithium(req.body))));
router.post('/si', asyncH(async (req, res) => res.json(engine.funcs().suicidality(req.body))));
router.post('/followup', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;
