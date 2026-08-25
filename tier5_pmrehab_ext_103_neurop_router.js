// filepath: tier5_pmrehab_ext_103_neurop_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_103_neurop_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assessment(req.body))));
router.post('/first', asyncH(async (req, res) => res.json(engine.funcs().first_line(req.body))));
router.post('/op', asyncH(async (req, res) => res.json(engine.funcs().opioids(req.body))));
router.post('/top', asyncH(async (req, res) => res.json(engine.funcs().topical(req.body))));
router.post('/proc', asyncH(async (req, res) => res.json(engine.funcs().procedures(req.body))));
router.post('/mon', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));
module.exports = router;