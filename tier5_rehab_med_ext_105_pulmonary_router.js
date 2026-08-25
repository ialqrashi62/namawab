// filepath: tier5_rehab_med_ext_105_pulmonary_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_med_ext_105_pulmonary_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assessment(req.body))));
router.post('/ex', asyncH(async (req, res) => res.json(engine.funcs().exercise_prescription(req.body))));
router.post('/edu', asyncH(async (req, res) => res.json(engine.funcs().education(req.body))));
router.post('/o2', asyncH(async (req, res) => res.json(engine.funcs().oxygen(req.body))));
router.post('/exac', asyncH(async (req, res) => res.json(engine.funcs().exacerbation(req.body))));
router.post('/psy', asyncH(async (req, res) => res.json(engine.funcs().psychosocial(req.body))));
module.exports = router;
