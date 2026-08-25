// filepath: tier5_ger_ext_118_caregiver_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ger_ext_118_caregiver_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/intake', asyncH(async (req, res) => res.json(engine.funcs().caregiver_intake(req.body))));
router.post('/burden', asyncH(async (req, res) => res.json(engine.funcs().burden(req.body))));
router.post('/training', asyncH(async (req, res) => res.json(engine.funcs().training(req.body))));
router.post('/advance', asyncH(async (req, res) => res.json(engine.funcs().advance_directive(req.body))));
router.post('/hospice', asyncH(async (req, res) => res.json(engine.funcs().hospice(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().caregiver_fu(req.body))));
module.exports = router;
