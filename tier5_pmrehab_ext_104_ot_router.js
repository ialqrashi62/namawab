// filepath: tier5_pmrehab_ext_104_ot_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_104_ot_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assess(req.body))));
router.post('/adl', asyncH(async (req, res) => res.json(engine.funcs().adl(req.body))));
router.post('/spl', asyncH(async (req, res) => res.json(engine.funcs().splint(req.body))));
router.post('/whl', asyncH(async (req, res) => res.json(engine.funcs().wheelchair(req.body))));
router.post('/home', asyncH(async (req, res) => res.json(engine.funcs().home_mod(req.body))));
router.post('/prog', asyncH(async (req, res) => res.json(engine.funcs().progress(req.body))));
module.exports = router;