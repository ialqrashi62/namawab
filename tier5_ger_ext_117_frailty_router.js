// filepath: tier5_ger_ext_117_frailty_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ger_ext_117_frailty_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/index', asyncH(async (req, res) => res.json(engine.funcs().frailty_index(req.body))));
router.post('/sarc', asyncH(async (req, res) => res.json(engine.funcs().sarc_screen(req.body))));
router.post('/prehab', asyncH(async (req, res) => res.json(engine.funcs().prehab(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().frailty_med(req.body))));
router.post('/discharge', asyncH(async (req, res) => res.json(engine.funcs().discharge(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().frailty_fu(req.body))));
module.exports = router;
