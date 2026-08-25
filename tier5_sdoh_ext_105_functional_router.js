// filepath: tier5_sdoh_ext_105_functional_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sdoh_ext_105_functional_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/katz', asyncH(async (req, res) => res.json(engine.funcs().katz_adl(req.body))));
router.post('/lawton', asyncH(async (req, res) => res.json(engine.funcs().lawton_iadl_v2(req.body))));
router.post('/whodas', asyncH(async (req, res) => res.json(engine.funcs().whodas(req.body))));
router.post('/pedi', asyncH(async (req, res) => res.json(engine.funcs().pedi_class(req.body))));
router.post('/fim', asyncH(async (req, res) => res.json(engine.funcs().fim(req.body))));

module.exports = router;
