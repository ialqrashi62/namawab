// filepath: tier5_rehab_ext_102_ot_adl_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_ext_102_ot_adl_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/barthel', asyncH(async (req, res) => res.json(engine.funcs().barthel_index(req.body))));
router.post('/lawton', asyncH(async (req, res) => res.json(engine.funcs().lawton_iadl(req.body))));
router.post('/splint', asyncH(async (req, res) => res.json(engine.funcs().splint_recommend(req.body))));
router.post('/ergo', asyncH(async (req, res) => res.json(engine.funcs().ergonomics_assess(req.body))));
router.post('/adlplan', asyncH(async (req, res) => res.json(engine.funcs().adl_training_plan(req.body))));

module.exports = router;
