// filepath: tier5_cardiology_ext_103_echo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_cardiology_ext_103_echo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indications(req.body))));
router.post('/tte', asyncH(async (req, res) => res.json(engine.funcs().tte(req.body))));
router.post('/tee', asyncH(async (req, res) => res.json(engine.funcs().tee(req.body))));
router.post('/fn', asyncH(async (req, res) => res.json(engine.funcs().function_eval(req.body))));
router.post('/val', asyncH(async (req, res) => res.json(engine.funcs().valvular(req.body))));
router.post('/peri', asyncH(async (req, res) => res.json(engine.funcs().pericardial(req.body))));
module.exports = router;
