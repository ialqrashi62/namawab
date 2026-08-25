// filepath: tier5_surg_spec_ext_101_cardiothoracic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_surg_spec_ext_101_cardiothoracic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cabg', asyncH(async (req, res) => res.json(engine.funcs().cabg(req.body))));
router.post('/valve', asyncH(async (req, res) => res.json(engine.funcs().valve(req.body))));
router.post('/aortic', asyncH(async (req, res) => res.json(engine.funcs().aortic_pathology(req.body))));
router.post('/lung', asyncH(async (req, res) => res.json(engine.funcs().lung_resection(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().transplant_heart_lung(req.body))));
router.post('/postop', asyncH(async (req, res) => res.json(engine.funcs().postop_care(req.body))));
module.exports = router;
