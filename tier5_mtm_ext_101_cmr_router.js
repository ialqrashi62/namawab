// filepath: tier5_mtm_ext_101_cmr_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_mtm_ext_101_cmr_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/review', asyncH(async (req, res) => res.json(engine.funcs().med_review(req.body))));
router.post('/drp', asyncH(async (req, res) => res.json(engine.funcs().drug_related_problems(req.body))));
router.post('/allergy', asyncH(async (req, res) => res.json(engine.funcs().allergies_check(req.body))));
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication_review(req.body))));
router.post('/simpl', asyncH(async (req, res) => res.json(engine.funcs().regimen_simplification(req.body))));
router.post('/cost', asyncH(async (req, res) => res.json(engine.funcs().cost_review(req.body))));

module.exports = router;
