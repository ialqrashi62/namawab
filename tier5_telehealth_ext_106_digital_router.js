// filepath: tier5_telehealth_ext_106_digital_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_telehealth_ext_106_digital_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/plt', asyncH(async (req, res) => res.json(engine.funcs().platform(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().compliance(req.body))));
router.post('/ihe', asyncH(async (req, res) => res.json(engine.funcs().interoperability(req.body))));
router.post('/dg', asyncH(async (req, res) => res.json(engine.funcs().data_governance(req.body))));
router.post('/ch', asyncH(async (req, res) => res.json(engine.funcs().change(req.body))));
router.post('/ad', asyncH(async (req, res) => res.json(engine.funcs().adoption(req.body))));
module.exports = router;
