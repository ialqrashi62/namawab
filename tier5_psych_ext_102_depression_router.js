// filepath: tier5_psych_ext_102_depression_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_102_depression_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/startpoint', asyncH(async (req, res) => res.json(engine.funcs().start_point(req.body))));
router.post('/augment', asyncH(async (req, res) => res.json(engine.funcs().augmentation(req.body))));
router.post('/tca-levels', asyncH(async (req, res) => res.json(engine.funcs().tca_level(req.body))));
router.post('/peripartum', asyncH(async (req, res) => res.json(engine.funcs().peripartum(req.body))));
router.post('/monitor', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));

module.exports = router;
