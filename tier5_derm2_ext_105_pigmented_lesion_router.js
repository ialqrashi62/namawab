// filepath: tier5_derm2_ext_105_pigmented_lesion_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm2_ext_105_pigmented_lesion_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/abcde', asyncH(async (req, res) => res.json(engine.funcs().abcde_score(req.body))));
router.post('/dlx', asyncH(async (req, res) => res.json(engine.funcs().dermatoscopy(req.body))));
router.post('/excising', asyncH(async (req, res) => res.json(engine.funcs().excision_margin(req.body))));
router.post('/cryo', asyncH(async (req, res) => res.json(engine.funcs().cryo_setup(req.body))));
router.post('/pathology', asyncH(async (req, res) => res.json(engine.funcs().pathology_reporting(req.body))));

module.exports = router;
