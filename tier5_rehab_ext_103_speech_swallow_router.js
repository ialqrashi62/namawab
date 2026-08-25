// filepath: tier5_rehab_ext_103_speech_swallow_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_ext_103_speech_swallow_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/dysphagia', asyncH(async (req, res) => res.json(engine.funcs().dysphagia_screen(req.body))));
router.post('/aspiration', asyncH(async (req, res) => res.json(engine.funcs().aspiration_risk(req.body))));
router.post('/diet', asyncH(async (req, res) => res.json(engine.funcs().diet_dysphagia(req.body))));
router.post('/aphasia', asyncH(async (req, res) => res.json(engine.funcs().aphasia_stage(req.body))));
router.post('/trach', asyncH(async (req, res) => res.json(engine.funcs().trach_swallow_eval(req.body))));

module.exports = router;
