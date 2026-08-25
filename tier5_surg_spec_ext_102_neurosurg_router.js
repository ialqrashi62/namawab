// filepath: tier5_surg_spec_ext_102_neurosurg_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_surg_spec_ext_102_neurosurg_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/crani', asyncH(async (req, res) => res.json(engine.funcs().crainiotomy_indication(req.body))));
router.post('/spine', asyncH(async (req, res) => res.json(engine.funcs().spine_surgery(req.body))));
router.post('/tumor', asyncH(async (req, res) => res.json(engine.funcs().tumor_resection(req.body))));
router.post('/vasc', asyncH(async (req, res) => res.json(engine.funcs().vascular(req.body))));
router.post('/trauma', asyncH(async (req, res) => res.json(engine.funcs().trauma(req.body))));
router.post('/postop', asyncH(async (req, res) => res.json(engine.funcs().postop_neuro(req.body))));
module.exports = router;
