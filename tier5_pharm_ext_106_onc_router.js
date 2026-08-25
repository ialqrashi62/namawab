// filepath: tier5_pharm_ext_106_onc_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharm_ext_106_onc_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/em', asyncH(async (req, res) => res.json(engine.funcs().emesis(req.body))));
router.post('/dose', asyncH(async (req, res) => res.json(engine.funcs().chemo_dose(req.body))));
router.post('/ext', asyncH(async (req, res) => res.json(engine.funcs().extravasation(req.body))));
router.post('/sup', asyncH(async (req, res) => res.json(engine.funcs().supportive(req.body))));
router.post('/tox', asyncH(async (req, res) => res.json(engine.funcs().toxicity(req.body))));
router.post('/adh', asyncH(async (req, res) => res.json(engine.funcs().adherence(req.body))));
module.exports = router;