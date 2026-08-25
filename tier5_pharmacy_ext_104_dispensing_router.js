// filepath: tier5_pharmacy_ext_104_dispensing_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharmacy_ext_104_dispensing_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/final', asyncH(async (req, res) => res.json(engine.funcs().final_check(req.body))));
router.post('/prep', asyncH(async (req, res) => res.json(engine.funcs().ivprep(req.body))));
router.post('/cis', asyncH(async (req, res) => res.json(engine.funcs().cis(req.body))));
router.post('/label', asyncH(async (req, res) => res.json(engine.funcs().label_check(req.body))));
router.post('/stock', asyncH(async (req, res) => res.json(engine.funcs().stock_status(req.body))));

module.exports = router;
