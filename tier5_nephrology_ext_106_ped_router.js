// filepath: tier5_nephrology_ext_106_ped_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nephrology_ext_106_ped_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/uti', asyncH(async (req, res) => res.json(engine.funcs().uti(req.body))));
router.post('/vur', asyncH(async (req, res) => res.json(engine.funcs().vesicoureteral(req.body))));
router.post('/ns', asyncH(async (req, res) => res.json(engine.funcs().nephrotic(req.body))));
router.post('/hus', asyncH(async (req, res) => res.json(engine.funcs().hemolytic_uremic(req.body))));
router.post('/gr', asyncH(async (req, res) => res.json(engine.funcs().growth(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().transplantation(req.body))));
module.exports = router;