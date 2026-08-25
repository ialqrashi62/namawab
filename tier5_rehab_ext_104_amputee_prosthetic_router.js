// filepath: tier5_rehab_ext_104_amputee_prosthetic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_ext_104_amputee_prosthetic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/level', asyncH(async (req, res) => res.json(engine.funcs().amputation_level(req.body))));
router.post('/prosfit', asyncH(async (req, res) => res.json(engine.funcs().pros_fit(req.body))));
router.post('/gaittrain', asyncH(async (req, res) => res.json(engine.funcs().gait_training(req.body))));
router.post('/residual', asyncH(async (req, res) => res.json(engine.funcs().residual_limb_eval(req.body))));
router.post('/phantom', asyncH(async (req, res) => res.json(engine.funcs().phantom_pain(req.body))));

module.exports = router;
