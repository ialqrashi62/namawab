// filepath: tier5_public_health_ext_105_env_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_public_health_ext_105_env_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/wat', asyncH(async (req, res) => res.json(engine.funcs().water(req.body))));
router.post('/air', asyncH(async (req, res) => res.json(engine.funcs().air(req.body))));
router.post('/food', asyncH(async (req, res) => res.json(engine.funcs().food(req.body))));
router.post('/lead', asyncH(async (req, res) => res.json(engine.funcs().lead(req.body))));
router.post('/vec', asyncH(async (req, res) => res.json(engine.funcs().vector(req.body))));
router.post('/cli', asyncH(async (req, res) => res.json(engine.funcs().climate(req.body))));
module.exports = router;
