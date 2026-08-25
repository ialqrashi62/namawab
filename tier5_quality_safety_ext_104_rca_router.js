// filepath: tier5_quality_safety_ext_104_rca_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_quality_safety_ext_104_rca_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/tm', asyncH(async (req, res) => res.json(engine.funcs().team(req.body))));
router.post('/data', asyncH(async (req, res) => res.json(engine.funcs().data(req.body))));
router.post('/fh', asyncH(async (req, res) => res.json(engine.funcs().fishbone(req.body))));
router.post('/5w', asyncH(async (req, res) => res.json(engine.funcs().five_why(req.body))));
router.post('/ch', asyncH(async (req, res) => res.json(engine.funcs().changes(req.body))));
router.post('/sum', asyncH(async (req, res) => res.json(engine.funcs().summary(req.body))));
module.exports = router;
