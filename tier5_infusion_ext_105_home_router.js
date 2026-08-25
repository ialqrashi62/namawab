// filepath: tier5_infusion_ext_105_home_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_infusion_ext_105_home_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/elig', asyncH(async (req, res) => res.json(engine.funcs().eligibility(req.body))));
router.post('/ivig', asyncH(async (req, res) => res.json(engine.funcs().ivig(req.body))));
router.post('/vad', asyncH(async (req, res) => res.json(engine.funcs().vad(req.body))));
router.post('/chemo', asyncH(async (req, res) => res.json(engine.funcs().home_chemo(req.body))));
router.post('/monitor', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;
