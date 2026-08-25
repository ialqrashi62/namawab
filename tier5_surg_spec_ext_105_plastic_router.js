// filepath: tier5_surg_spec_ext_105_plastic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_surg_spec_ext_105_plastic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/flap', asyncH(async (req, res) => res.json(engine.funcs().flap_selection(req.body))));
router.post('/free', asyncH(async (req, res) => res.json(engine.funcs().microvascular_free_flap(req.body))));
router.post('/breast', asyncH(async (req, res) => res.json(engine.funcs().breast_reconstruction(req.body))));
router.post('/cleft', asyncH(async (req, res) => res.json(engine.funcs().cleft_repair(req.body))));
router.post('/burnrecon', asyncH(async (req, res) => res.json(engine.funcs().burn_reconstruction(req.body))));
router.post('/hand', asyncH(async (req, res) => res.json(engine.funcs().hand_trauma(req.body))));
module.exports = router;
