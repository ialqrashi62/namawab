// filepath: tier5_labauto_ext_104_micro_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_labauto_ext_104_micro_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cul', asyncH(async (req, res) => res.json(engine.funcs().culture(req.body))));
router.post('/id', asyncH(async (req, res) => res.json(engine.funcs().id(req.body))));
router.post('/ast', asyncH(async (req, res) => res.json(engine.funcs().ast(req.body))));
router.post('/bc', asyncH(async (req, res) => res.json(engine.funcs().blood_cx(req.body))));
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().staining(req.body))));
router.post('/rep', asyncH(async (req, res) => res.json(engine.funcs().reporting(req.body))));
module.exports = router;