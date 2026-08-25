// filepath: tier5_public_health_ext_103_outbreak_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_public_health_ext_103_outbreak_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/det', asyncH(async (req, res) => res.json(engine.funcs().detection(req.body))));
router.post('/hyp', asyncH(async (req, res) => res.json(engine.funcs().hypothesis(req.body))));
router.post('/curve', asyncH(async (req, res) => res.json(engine.funcs().epi_curve(req.body))));
router.post('/ctrl', asyncH(async (req, res) => res.json(engine.funcs().control(req.body))));
router.post('/lab', asyncH(async (req, res) => res.json(engine.funcs().lab(req.body))));
router.post('/clo', asyncH(async (req, res) => res.json(engine.funcs().closeout(req.body))));
module.exports = router;
