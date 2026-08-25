// filepath: tier5_nutrition2_ext_105_gi_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nutrition2_ext_105_gi_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ibd', asyncH(async (req, res) => res.json(engine.funcs().ibd(req.body))));
router.post('/ibs', asyncH(async (req, res) => res.json(engine.funcs().ibs(req.body))));
router.post('/celiac', asyncH(async (req, res) => res.json(engine.funcs().celiac(req.body))));
router.post('/sibo', asyncH(async (req, res) => res.json(engine.funcs().sibo(req.body))));
router.post('/liver', asyncH(async (req, res) => res.json(engine.funcs().liver(req.body))));
router.post('/pan', asyncH(async (req, res) => res.json(engine.funcs().pancreas(req.body))));
module.exports = router;
