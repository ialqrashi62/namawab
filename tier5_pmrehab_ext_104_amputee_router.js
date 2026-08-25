// filepath: tier5_pmrehab_ext_104_amputee_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_104_amputee_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/rx', asyncH(async (req, res) => res.json(engine.funcs().prosthetic_prescription(req.body))));
router.post('/gait', asyncH(async (req, res) => res.json(engine.funcs().gait_deviation(req.body))));
router.post('/res', asyncH(async (req, res) => res.json(engine.funcs().residual_limb(req.body))));
router.post('/trng', asyncH(async (req, res) => res.json(engine.funcs().prosthetic_training(req.body))));
router.post('/rtw', asyncH(async (req, res) => res.json(engine.funcs().return_to_work(req.body))));
router.post('/ph', asyncH(async (req, res) => res.json(engine.funcs().phantom_pain(req.body))));
module.exports = router;
