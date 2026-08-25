// filepath: tier5_pharm_ext_102_steward_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharm_ext_102_steward_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/cul', asyncH(async (req, res) => res.json(engine.funcs().culture(req.body))));
router.post('/dose', asyncH(async (req, res) => res.json(engine.funcs().dose_optimize(req.body))));
router.post('/route', asyncH(async (req, res) => res.json(engine.funcs().route_optimize(req.body))));
router.post('/dur', asyncH(async (req, res) => res.json(engine.funcs().duration(req.body))));
router.post('/mdr', asyncH(async (req, res) => res.json(engine.funcs().mdr(req.body))));
module.exports = router;