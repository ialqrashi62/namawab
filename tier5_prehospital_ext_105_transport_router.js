// filepath: tier5_prehospital_ext_105_transport_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_prehospital_ext_105_transport_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/mode', asyncH(async (req, res) => res.json(engine.funcs().mode(req.body))));
router.post('/dest', asyncH(async (req, res) => res.json(engine.funcs().destination(req.body))));
router.post('/hand', asyncH(async (req, res) => res.json(engine.funcs().handover(req.body))));
router.post('/doc', asyncH(async (req, res) => res.json(engine.funcs().documentation(req.body))));
router.post('/safe', asyncH(async (req, res) => res.json(engine.funcs().safety(req.body))));
router.post('/ref', asyncH(async (req, res) => res.json(engine.funcs().refusals(req.body))));
module.exports = router;
