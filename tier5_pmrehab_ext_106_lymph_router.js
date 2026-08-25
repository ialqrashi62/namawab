// filepath: tier5_pmrehab_ext_106_lymph_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_106_lymph_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().lymphedema_stage(req.body))));
router.post('/cdt', asyncH(async (req, res) => res.json(engine.funcs().cdt_protocol(req.body))));
router.post('/wound', asyncH(async (req, res) => res.json(engine.funcs().chronic_wound(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().compression_garment(req.body))));
router.post('/self', asyncH(async (req, res) => res.json(engine.funcs().self_care(req.body))));
router.post('/func', asyncH(async (req, res) => res.json(engine.funcs().function_outcome(req.body))));
module.exports = router;
