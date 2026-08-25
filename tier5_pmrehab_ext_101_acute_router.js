// filepath: tier5_pmrehab_ext_101_acute_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_101_acute_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assess(req.body))));
router.post('/nono', asyncH(async (req, res) => res.json(engine.funcs().nonopioid(req.body))));
router.post('/op', asyncH(async (req, res) => res.json(engine.funcs().opioid(req.body))));
router.post('/reg', asyncH(async (req, res) => res.json(engine.funcs().regional(req.body))));
router.post('/pca', asyncH(async (req, res) => res.json(engine.funcs().pca(req.body))));
router.post('/trans', asyncH(async (req, res) => res.json(engine.funcs().transition(req.body))));
module.exports = router;