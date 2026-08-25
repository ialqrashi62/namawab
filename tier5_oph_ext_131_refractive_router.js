// filepath: tier5_oph_ext_131_refractive_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_131_refractive_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/screening', asyncH(async (req, res) => res.json(engine.funcs().screening(req.body))));
router.post('/lasik', asyncH(async (req, res) => res.json(engine.funcs().lasik(req.body))));
router.post('/prk', asyncH(async (req, res) => res.json(engine.funcs().prk(req.body))));
router.post('/icl', asyncH(async (req, res) => res.json(engine.funcs().icl(req.body))));
router.post('/smile', asyncH(async (req, res) => res.json(engine.funcs().smile(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().refractive_fu(req.body))));
module.exports = router;
