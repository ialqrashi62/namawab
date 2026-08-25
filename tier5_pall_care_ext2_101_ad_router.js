// filepath: tier5_pall_care_ext2_101_ad_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext2_101_ad_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/rev', asyncH(async (req, res) => res.json(engine.funcs().ad_review(req.body))));
router.post('/goc', asyncH(async (req, res) => res.json(engine.funcs().goals_care(req.body))));
router.post('/cs', asyncH(async (req, res) => res.json(engine.funcs().code_status(req.body))));
router.post('/cap', asyncH(async (req, res) => res.json(engine.funcs().capacity(req.body))));
router.post('/surr', asyncH(async (req, res) => res.json(engine.funcs().surrogate(req.body))));
router.post('/store', asyncH(async (req, res) => res.json(engine.funcs().ad_storage(req.body))));
module.exports = router;
