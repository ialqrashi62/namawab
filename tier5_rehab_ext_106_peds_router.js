// filepath: tier5_rehab_ext_106_peds_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_ext_106_peds_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/gm', asyncH(async (req, res) => res.json(engine.funcs().gmfs_classification(req.body))));
router.post('/eval', asyncH(async (req, res) => res.json(engine.funcs().gm_evaluation(req.body))));
router.post('/cerebralpalsy', asyncH(async (req, res) => res.json(engine.funcs().cp_classification(req.body))));
router.post('/neurodev', asyncH(async (req, res) => res.json(engine.funcs().neuro_dev_screening(req.body))));
router.post('/dystonia', asyncH(async (req, res) => res.json(engine.funcs().dystonia_class(req.body))));

module.exports = router;
