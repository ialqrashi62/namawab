// filepath: tier5_pain_ext_105_palliative_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pain_ext_105_palliative_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/prognosis', asyncH(async (req, res) => res.json(engine.funcs().prognosis(req.body))));
router.post('/goals', asyncH(async (req, res) => res.json(engine.funcs().goals_discussion(req.body))));
router.post('/dyspnea', asyncH(async (req, res) => res.json(engine.funcs().dyspnea(req.body))));
router.post('/delirium', asyncH(async (req, res) => res.json(engine.funcs().delirium(req.body))));
router.post('/hospice', asyncH(async (req, res) => res.json(engine.funcs().hospice_status(req.body))));

module.exports = router;
