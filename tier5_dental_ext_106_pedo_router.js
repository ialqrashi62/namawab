// filepath: tier5_dental_ext_106_pedo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_dental_ext_106_pedo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/ecc', asyncH(async (req, res) => res.json(engine.funcs().early_childhood_caries(req.body))));
router.post('/fluoride', asyncH(async (req, res) => res.json(engine.funcs().fluoride(req.body))));
router.post('/seal', asyncH(async (req, res) => res.json(engine.funcs().sealant(req.body))));
router.post('/pulp', asyncH(async (req, res) => res.json(engine.funcs().pulp_therapy(req.body))));
router.post('/space', asyncH(async (req, res) => res.json(engine.funcs().space_maintainer(req.body))));
router.post('/behav', asyncH(async (req, res) => res.json(engine.funcs().behavior(req.body))));

module.exports = router;
