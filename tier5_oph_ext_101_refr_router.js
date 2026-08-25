// filepath: tier5_oph_ext_101_refr_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_101_refr_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/va', asyncH(async (req, res) => res.json(engine.funcs().va(req.body))));
router.post('/ref', asyncH(async (req, res) => res.json(engine.funcs().refraction(req.body))));
router.post('/pre', asyncH(async (req, res) => res.json(engine.funcs().prescribe(req.body))));
router.post('/lv', asyncH(async (req, res) => res.json(engine.funcs().low_vision(req.body))));
router.post('/ped', asyncH(async (req, res) => res.json(engine.funcs().peds(req.body))));
router.post('/ct', asyncH(async (req, res) => res.json(engine.funcs().contact(req.body))));
module.exports = router;