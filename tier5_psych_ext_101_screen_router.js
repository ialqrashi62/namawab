// filepath: tier5_psych_ext_101_screen_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_101_screen_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/phq', asyncH(async (req, res) => res.json(engine.funcs().phq9(req.body))));
router.post('/gad', asyncH(async (req, res) => res.json(engine.funcs().gad7(req.body))));
router.post('/mdq', asyncH(async (req, res) => res.json(engine.funcs().mdq(req.body))));
router.post('/pcl', asyncH(async (req, res) => res.json(engine.funcs().pcl5(req.body))));
router.post('/cssrs', asyncH(async (req, res) => res.json(engine.funcs().cssrs(req.body))));

module.exports = router;
