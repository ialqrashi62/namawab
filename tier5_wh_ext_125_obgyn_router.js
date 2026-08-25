// filepath: tier5_wh_ext_125_obgyn_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wh_ext_125_obgyn_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/antenatal', asyncH(async (req, res) => res.json(engine.funcs().antenatal_visit(req.body))));
router.post('/exam', asyncH(async (req, res) => res.json(engine.funcs().gyn_exam(req.body))));
router.post('/contra', asyncH(async (req, res) => res.json(engine.funcs().contraception(req.body))));
router.post('/sti', asyncH(async (req, res) => res.json(engine.funcs().sti_screen(req.body))));
router.post('/menopause', asyncH(async (req, res) => res.json(engine.funcs().menopause(req.body))));
router.post('/postpartum', asyncH(async (req, res) => res.json(engine.funcs().postpartum(req.body))));
module.exports = router;
