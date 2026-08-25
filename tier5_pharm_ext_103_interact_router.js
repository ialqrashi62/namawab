// filepath: tier5_pharm_ext_103_interact_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharm_ext_103_interact_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cls', asyncH(async (req, res) => res.json(engine.funcs().classify(req.body))));
router.post('/pk', asyncH(async (req, res) => res.json(engine.funcs().pk_interactions(req.body))));
router.post('/pd', asyncH(async (req, res) => res.json(engine.funcs().pd_interactions(req.body))));
router.post('/qt', asyncH(async (req, res) => res.json(engine.funcs().qt(req.body))));
router.post('/alg', asyncH(async (req, res) => res.json(engine.funcs().allergy(req.body))));
router.post('/rh', asyncH(async (req, res) => res.json(engine.funcs().renal_hepatic(req.body))));
module.exports = router;