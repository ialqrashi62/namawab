// filepath: tier5_imaging_ext_101_us_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_imaging_ext_101_us_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/fast', asyncH(async (req, res) => res.json(engine.funcs().fast_scan(req.body))));
router.post('/dvt', asyncH(async (req, res) => res.json(engine.funcs().vascular_dvt(req.body))));
router.post('/echo', asyncH(async (req, res) => res.json(engine.funcs().echo_view(req.body))));
router.post('/ob', asyncH(async (req, res) => res.json(engine.funcs().ob_us(req.body))));
router.post('/msk', asyncH(async (req, res) => res.json(engine.funcs().msk_us(req.body))));
router.post('/ceus', asyncH(async (req, res) => res.json(engine.funcs().contrast_us(req.body))));

module.exports = router;
