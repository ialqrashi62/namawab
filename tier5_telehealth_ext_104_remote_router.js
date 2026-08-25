// filepath: tier5_telehealth_ext_104_remote_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_telehealth_ext_104_remote_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/enr', asyncH(async (req, res) => res.json(engine.funcs().enrollment(req.body))));
router.post('/data', asyncH(async (req, res) => res.json(engine.funcs().data(req.body))));
router.post('/alert', asyncH(async (req, res) => res.json(engine.funcs().alerts(req.body))));
router.post('/dev', asyncH(async (req, res) => res.json(engine.funcs().devices(req.body))));
router.post('/edu', asyncH(async (req, res) => res.json(engine.funcs().education(req.body))));
router.post('/out', asyncH(async (req, res) => res.json(engine.funcs().outcomes(req.body))));
module.exports = router;
