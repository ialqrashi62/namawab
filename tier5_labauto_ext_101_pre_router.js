// filepath: tier5_labauto_ext_101_pre_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_labauto_ext_101_pre_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ord', asyncH(async (req, res) => res.json(engine.funcs().order(req.body))));
router.post('/spec', asyncH(async (req, res) => res.json(engine.funcs().specimen(req.body))));
router.post('/trans', asyncH(async (req, res) => res.json(engine.funcs().transport(req.body))));
router.post('/acc', asyncH(async (req, res) => res.json(engine.funcs().accession(req.body))));
router.post('/rej', asyncH(async (req, res) => res.json(engine.funcs().rejection(req.body))));
router.post('/track', asyncH(async (req, res) => res.json(engine.funcs().tracking(req.body))));
module.exports = router;