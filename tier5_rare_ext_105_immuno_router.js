// filepath: tier5_rare_ext_105_immuno_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rare_ext_105_immuno_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/jeffrey', asyncH(async (req, res) => res.json(engine.funcs().pid_screen_jeffrey(req.body))));
router.post('/prodigy', asyncH(async (req, res) => res.json(engine.funcs().prodigy_classification(req.body))));
router.post('/autoin', asyncH(async (req, res) => res.json(engine.funcs().autoinflammatory(req.body))));
router.post('/ige', asyncH(async (req, res) => res.json(engine.funcs().ige_hyper(req.body))));
router.post('/complement', asyncH(async (req, res) => res.json(engine.funcs().complement_deficiency(req.body))));

module.exports = router;
