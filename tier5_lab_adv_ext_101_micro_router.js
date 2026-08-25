// filepath: tier5_lab_adv_ext_101_micro_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_lab_adv_ext_101_micro_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/bc', asyncH(async (req, res) => res.json(engine.funcs().blood_culture(req.body))));
router.post('/tb', asyncH(async (req, res) => res.json(engine.funcs().tb_workup(req.body))));
router.post('/fungi', asyncH(async (req, res) => res.json(engine.funcs().fungal(req.body))));
router.post('/vl', asyncH(async (req, res) => res.json(engine.funcs().viral_load(req.body))));
router.post('/mdro', asyncH(async (req, res) => res.json(engine.funcs().molecular_id(req.body))));
router.post('/sero', asyncH(async (req, res) => res.json(engine.funcs().serology(req.body))));
module.exports = router;
