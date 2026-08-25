// filepath: tier5_womens_ext_106_meno_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_womens_ext_106_meno_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/vaso', asyncH(async (req, res) => res.json(engine.funcs().vasomotor(req.body))));
router.post('/hrtcand', asyncH(async (req, res) => res.json(engine.funcs().hrt_candidate(req.body))));
router.post('/bone', asyncH(async (req, res) => res.json(engine.funcs().bone_health(req.body))));
router.post('/va', asyncH(async (req, res) => res.json(engine.funcs().vaginal_atrophy(req.body))));
router.post('/mood', asyncH(async (req, res) => res.json(engine.funcs().mood_sleep(req.body))));
router.post('/lib', asyncH(async (req, res) => res.json(engine.funcs().libido(req.body))));
module.exports = router;
