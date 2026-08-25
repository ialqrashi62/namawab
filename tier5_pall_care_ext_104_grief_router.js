// filepath: tier5_pall_care_ext_104_grief_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext_104_grief_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().grief_assessment(req.body))));
router.post('/interv', asyncH(async (req, res) => res.json(engine.funcs().grief_intervention(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complicated_grief(req.body))));
router.post('/children', asyncH(async (req, res) => res.json(engine.funcs().children_grief(req.body))));
router.post('/anticip', asyncH(async (req, res) => res.json(engine.funcs().anticipatory_grief(req.body))));
router.post('/staff', asyncH(async (req, res) => res.json(engine.funcs().staff_bereavement(req.body))));
module.exports = router;
