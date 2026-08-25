// filepath: tier5_ops_ext_101_bed_mgmt_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ops_ext_101_bed_mgmt_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/turnover', asyncH(async (req, res) => res.json(engine.funcs().turnover_rate(req.body))));
router.post('/blocking', asyncH(async (req, res) => res.json(engine.funcs().bed_blocking(req.body))));
router.post('/capacity', asyncH(async (req, res) => res.json(engine.funcs().capacity_plan(req.body))));
router.post('/alos', asyncH(async (req, res) => res.json(engine.funcs().alos_trend(req.body))));
router.post('/prioritize', asyncH(async (req, res) => res.json(engine.funcs().prioritize_admissions(req.body))));

module.exports = router;
