// filepath: tier5_nutrition2_ext_102_bariatric_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nutrition2_ext_102_bariatric_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/preop', asyncH(async (req, res) => res.json(engine.funcs().preop_eval(req.body))));
router.post('/early', asyncH(async (req, res) => res.json(engine.funcs().postop_early(req.body))));
router.post('/vitd', asyncH(async (req, res) => res.json(engine.funcs().vitamin_deficiency(req.body))));
router.post('/dump', asyncH(async (req, res) => res.json(engine.funcs().dumping_syndrome(req.body))));
router.post('/wt', asyncH(async (req, res) => res.json(engine.funcs().weight_loss_tracking(req.body))));
router.post('/long', asyncH(async (req, res) => res.json(engine.funcs().long_term(req.body))));
module.exports = router;
