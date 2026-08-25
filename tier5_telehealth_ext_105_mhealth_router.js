// filepath: tier5_telehealth_ext_105_mhealth_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_telehealth_ext_105_mhealth_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sel', asyncH(async (req, res) => res.json(engine.funcs().app_selection(req.body))));
router.post('/rx', asyncH(async (req, res) => res.json(engine.funcs().prescription(req.body))));
router.post('/integ', asyncH(async (req, res) => res.json(engine.funcs().data_integration(req.body))));
router.post('/eng', asyncH(async (req, res) => res.json(engine.funcs().engagement(req.body))));
router.post('/priv', asyncH(async (req, res) => res.json(engine.funcs().privacy(req.body))));
router.post('/rev', asyncH(async (req, res) => res.json(engine.funcs().review(req.body))));
module.exports = router;
