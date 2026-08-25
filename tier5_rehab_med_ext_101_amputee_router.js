// filepath: tier5_rehab_med_ext_101_amputee_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_med_ext_101_amputee_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pre', asyncH(async (req, res) => res.json(engine.funcs().preprosth(req.body))));
router.post('/pros', asyncH(async (req, res) => res.json(engine.funcs().prosthetic(req.body))));
router.post('/gait', asyncH(async (req, res) => res.json(engine.funcs().gait(req.body))));
router.post('/phan', asyncH(async (req, res) => res.json(engine.funcs().phantom_pain(req.body))));
router.post('/skin', asyncH(async (req, res) => res.json(engine.funcs().residual_skin(req.body))));
router.post('/home', asyncH(async (req, res) => res.json(engine.funcs().home_safety(req.body))));
module.exports = router;
