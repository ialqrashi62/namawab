// filepath: tier5_nephrology_ext_103_aki_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nephrology_ext_103_aki_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/et', asyncH(async (req, res) => res.json(engine.funcs().etiology(req.body))));
router.post('/fl', asyncH(async (req, res) => res.json(engine.funcs().fluids(req.body))));
router.post('/neph', asyncH(async (req, res) => res.json(engine.funcs().nephrotoxins(req.body))));
router.post('/rrt', asyncH(async (req, res) => res.json(engine.funcs().rrt(req.body))));
router.post('/rec', asyncH(async (req, res) => res.json(engine.funcs().recovery(req.body))));
module.exports = router;