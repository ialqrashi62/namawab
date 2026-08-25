// filepath: tier5_nutrition2_ext_101_renal_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nutrition2_ext_101_renal_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ckd', asyncH(async (req, res) => res.json(engine.funcs().ckd_nutrition(req.body))));
router.post('/dialysis', asyncH(async (req, res) => res.json(engine.funcs().dialysis_nutrition(req.body))));
router.post('/elect', asyncH(async (req, res) => res.json(engine.funcs().electrolyte_balance(req.body))));
router.post('/fluid', asyncH(async (req, res) => res.json(engine.funcs().fluid_mgmt(req.body))));
router.post('/edu', asyncH(async (req, res) => res.json(engine.funcs().renal_diet_education(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().transplant_nutrition(req.body))));
module.exports = router;
