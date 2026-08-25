// filepath: tier5_prehospital_ext_106_ops_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_prehospital_ext_106_ops_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ready', asyncH(async (req, res) => res.json(engine.funcs().readiness(req.body))));
router.post('/rt', asyncH(async (req, res) => res.json(engine.funcs().response_time(req.body))));
router.post('/cov', asyncH(async (req, res) => res.json(engine.funcs().coverage(req.body))));
router.post('/qa', asyncH(async (req, res) => res.json(engine.funcs().quality(req.body))));
router.post('/edu', asyncH(async (req, res) => res.json(engine.funcs().education(req.body))));
router.post('/hp', asyncH(async (req, res) => res.json(engine.funcs().health(req.body))));
module.exports = router;
