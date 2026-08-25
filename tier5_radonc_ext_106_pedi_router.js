// filepath: tier5_radonc_ext_106_pedi_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_radonc_ext_106_pedi_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/sed', asyncH(async (req, res) => res.json(engine.funcs().sedation(req.body))));
router.post('/cs', asyncH(async (req, res) => res.json(engine.funcs().craniospinal(req.body))));
router.post('/pro', asyncH(async (req, res) => res.json(engine.funcs().proton(req.body))));
router.post('/late', asyncH(async (req, res) => res.json(engine.funcs().late_effects(req.body))));
router.post('/sur', asyncH(async (req, res) => res.json(engine.funcs().survivorship(req.body))));
module.exports = router;