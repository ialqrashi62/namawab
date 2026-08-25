// filepath: tier5_public_health_ext_106_promo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_public_health_ext_106_promo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assessment(req.body))));
router.post('/edu', asyncH(async (req, res) => res.json(engine.funcs().education(req.body))));
router.post('/life', asyncH(async (req, res) => res.json(engine.funcs().lifestyle(req.body))));
router.post('/res', asyncH(async (req, res) => res.json(engine.funcs().community_resources(req.body))));
router.post('/lit', asyncH(async (req, res) => res.json(engine.funcs().literacy(req.body))));
router.post('/camp', asyncH(async (req, res) => res.json(engine.funcs().campaign(req.body))));
module.exports = router;
