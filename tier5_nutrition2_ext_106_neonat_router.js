// filepath: tier5_nutrition2_ext_106_neonat_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nutrition2_ext_106_neonat_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/tpn', asyncH(async (req, res) => res.json(engine.funcs().neonatal_tpn(req.body))));
router.post('/milk', asyncH(async (req, res) => res.json(engine.funcs().breast_milk(req.body))));
router.post('/fort', asyncH(async (req, res) => res.json(engine.funcs().fortifier(req.body))));
router.post('/growth', asyncH(async (req, res) => res.json(engine.funcs().growth_assessment(req.body))));
router.post('/nec', asyncH(async (req, res) => res.json(engine.funcs().nec_nutrition(req.body))));
router.post('/dch', asyncH(async (req, res) => res.json(engine.funcs().discharge_feeding(req.body))));
module.exports = router;
