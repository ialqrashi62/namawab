// filepath: tier5_ent_ext_101_rhino_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ent_ext_101_rhino_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sin', asyncH(async (req, res) => res.json(engine.funcs().sinusitis(req.body))));
router.post('/alg', asyncH(async (req, res) => res.json(engine.funcs().allergies(req.body))));
router.post('/obst', asyncH(async (req, res) => res.json(engine.funcs().nasal_obstruction(req.body))));
router.post('/pol', asyncH(async (req, res) => res.json(engine.funcs().polyps(req.body))));
router.post('/epi', asyncH(async (req, res) => res.json(engine.funcs().epistaxis(req.body))));
router.post('/fn', asyncH(async (req, res) => res.json(engine.funcs().function_eval(req.body))));
module.exports = router;