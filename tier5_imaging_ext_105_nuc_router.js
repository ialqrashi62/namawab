// filepath: tier5_imaging_ext_105_nuc_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_imaging_ext_105_nuc_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/pet', asyncH(async (req, res) => res.json(engine.funcs().pet_oncology(req.body))));
router.post('/spect', asyncH(async (req, res) => res.json(engine.funcs().spect_cardiac(req.body))));
router.post('/bone', asyncH(async (req, res) => res.json(engine.funcs().bone_scan(req.body))));
router.post('/thyroid', asyncH(async (req, res) => res.json(engine.funcs().thyroid_scan(req.body))));
router.post('/parath', asyncH(async (req, res) => res.json(engine.funcs().parathyroid_scan(req.body))));
router.post('/sln', asyncH(async (req, res) => res.json(engine.funcs().sentinel_node(req.body))));

module.exports = router;
