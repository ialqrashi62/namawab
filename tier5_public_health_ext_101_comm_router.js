// filepath: tier5_public_health_ext_101_comm_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_public_health_ext_101_comm_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/dx', asyncH(async (req, res) => res.json(engine.funcs().diagnosis(req.body))));
router.post('/not', asyncH(async (req, res) => res.json(engine.funcs().notification(req.body))));
router.post('/cons', asyncH(async (req, res) => res.json(engine.funcs().contact(req.body))));
router.post('/iso', asyncH(async (req, res) => res.json(engine.funcs().isolation(req.body))));
router.post('/tr', asyncH(async (req, res) => res.json(engine.funcs().treatment(req.body))));
router.post('/post', asyncH(async (req, res) => res.json(engine.funcs().post(req.body))));
module.exports = router;
