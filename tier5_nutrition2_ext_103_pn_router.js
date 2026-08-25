// filepath: tier5_nutrition2_ext_103_pn_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nutrition2_ext_103_pn_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/macro', asyncH(async (req, res) => res.json(engine.funcs().pn_macronutrients(req.body))));
router.post('/micro', asyncH(async (req, res) => res.json(engine.funcs().pn_micronutrients(req.body))));
router.post('/compound', asyncH(async (req, res) => res.json(engine.funcs().pn_compound(req.body))));
router.post('/monitor', asyncH(async (req, res) => res.json(engine.funcs().pn_monitoring(req.body))));
router.post('/cyclic', asyncH(async (req, res) => res.json(engine.funcs().cyclic_pn(req.body))));
router.post('/trans', asyncH(async (req, res) => res.json(engine.funcs().transition_to_enteral(req.body))));
module.exports = router;
