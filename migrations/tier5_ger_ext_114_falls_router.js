// filepath: tier5_ger_ext_114_falls_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ger_ext_114_falls_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/screen', asyncH(async (req, res) => res.json(engine.funcs().risk_screen(req.body))));
router.post('/circ', asyncH(async (req, res) => res.json(engine.funcs().circ_check(req.body))));
router.post('/home', asyncH(async (req, res) => res.json(engine.funcs().home_safety(req.body))));
router.post('/exercise', asyncH(async (req, res) => res.json(engine.funcs().exercise(req.body))));
router.post('/post', asyncH(async (req, res) => res.json(engine.funcs().post_fall(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().fall_followup(req.body))));
module.exports = router;
