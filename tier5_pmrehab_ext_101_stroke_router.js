// filepath: tier5_pmrehab_ext_101_stroke_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_101_stroke_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/fim', asyncH(async (req, res) => res.json(engine.funcs().fim(req.body))));
router.post('/dysp', asyncH(async (req, res) => res.json(engine.funcs().dysphagia_screen(req.body))));
router.post('/mob', asyncH(async (req, res) => res.json(engine.funcs().mobility_rehab(req.body))));
router.post('/neg', asyncH(async (req, res) => res.json(engine.funcs().neglect_unilateral(req.body))));
router.post('/drive', asyncH(async (req, res) => res.json(engine.funcs().return_to_drive(req.body))));
router.post('/cog', asyncH(async (req, res) => res.json(engine.funcs().cognition_rehab(req.body))));
module.exports = router;
