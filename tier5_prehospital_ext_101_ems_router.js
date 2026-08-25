// filepath: tier5_prehospital_ext_101_ems_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_prehospital_ext_101_ems_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/prim', asyncH(async (req, res) => res.json(engine.funcs().primary_survey(req.body))));
router.post('/gcs', asyncH(async (req, res) => res.json(engine.funcs().gcs(req.body))));
router.post('/vit', asyncH(async (req, res) => res.json(engine.funcs().vitals(req.body))));
router.post('/pain', asyncH(async (req, res) => res.json(engine.funcs().pain_ems(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().medication(req.body))));
router.post('/fam', asyncH(async (req, res) => res.json(engine.funcs().family_contact(req.body))));
module.exports = router;
