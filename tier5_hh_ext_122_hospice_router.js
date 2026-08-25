// filepath: tier5_hh_ext_122_hospice_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_hh_ext_122_hospice_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/eligibility', asyncH(async (req, res) => res.json(engine.funcs().eligibility(req.body))));
router.post('/admission', asyncH(async (req, res) => res.json(engine.funcs().admission(req.body))));
router.post('/symptom', asyncH(async (req, res) => res.json(engine.funcs().symptom(req.body))));
router.post('/visits', asyncH(async (req, res) => res.json(engine.funcs().visits(req.body))));
router.post('/bereavement', asyncH(async (req, res) => res.json(engine.funcs().bereavement(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().hospice_fu(req.body))));
module.exports = router;
