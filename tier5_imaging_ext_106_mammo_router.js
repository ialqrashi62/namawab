// filepath: tier5_imaging_ext_106_mammo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_imaging_ext_106_mammo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/birads', asyncH(async (req, res) => res.json(engine.funcs().birads(req.body))));
router.post('/screen', asyncH(async (req, res) => res.json(engine.funcs().screening(req.body))));
router.post('/dbt', asyncH(async (req, res) => res.json(engine.funcs().dbt(req.body))));
router.post('/usadj', asyncH(async (req, res) => res.json(engine.funcs().us_adjunct(req.body))));
router.post('/mriadj', asyncH(async (req, res) => res.json(engine.funcs().mri_adjunct(req.body))));
router.post('/biopsy', asyncH(async (req, res) => res.json(engine.funcs().mammo_biopsy(req.body))));

module.exports = router;
