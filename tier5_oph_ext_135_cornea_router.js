// filepath: tier5_oph_ext_135_cornea_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_135_cornea_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/workup', asyncH(async (req, res) => res.json(engine.funcs().workup(req.body))));
router.post('/dry', asyncH(async (req, res) => res.json(engine.funcs().dry_eye(req.body))));
router.post('/infection', asyncH(async (req, res) => res.json(engine.funcs().infectious(req.body))));
router.post('/keratoconus', asyncH(async (req, res) => res.json(engine.funcs().keratoconus(req.body))));
router.post('/transplant', asyncH(async (req, res) => res.json(engine.funcs().transplant(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().cornea_fu(req.body))));
module.exports = router;
