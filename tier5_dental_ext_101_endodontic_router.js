// filepath: tier5_dental_ext_101_endodontic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_dental_ext_101_endodontic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/vital', asyncH(async (req, res) => res.json(engine.funcs().pulp_vitality(req.body))));
router.post('/rct', asyncH(async (req, res) => res.json(engine.funcs().root_canal_treatment(req.body))));
router.post('/apico', asyncH(async (req, res) => res.json(engine.funcs().apicoectomy(req.body))));
router.post('/retrt', asyncH(async (req, res) => res.json(engine.funcs().retreatment(req.body))));
router.post('/perf', asyncH(async (req, res) => res.json(engine.funcs().perforation(req.body))));
router.post('/trauma', asyncH(async (req, res) => res.json(engine.funcs().dental_trauma(req.body))));

module.exports = router;
