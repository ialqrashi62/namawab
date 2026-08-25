// filepath: tier5_wh_ext_126_maternal_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wh_ext_126_maternal_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/intake', asyncH(async (req, res) => res.json(engine.funcs().high_risk_intake(req.body))));
router.post('/preeclampsia', asyncH(async (req, res) => res.json(engine.funcs().preeclampsia(req.body))));
router.post('/gdm', asyncH(async (req, res) => res.json(engine.funcs().gdm_screen(req.body))));
router.post('/iugr', asyncH(async (req, res) => res.json(engine.funcs().iugr(req.body))));
router.post('/multifetal', asyncH(async (req, res) => res.json(engine.funcs().multifetal(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().mfm_fu(req.body))));
module.exports = router;
