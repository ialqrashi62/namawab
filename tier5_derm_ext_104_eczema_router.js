// filepath: tier5_derm_ext_104_eczema_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm_ext_104_eczema_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cls', asyncH(async (req, res) => res.json(engine.funcs().classify(req.body))));
router.post('/top', asyncH(async (req, res) => res.json(engine.funcs().topicals(req.body))));
router.post('/sys', asyncH(async (req, res) => res.json(engine.funcs().systemic(req.body))));
router.post('/trig', asyncH(async (req, res) => res.json(engine.funcs().triggers(req.body))));
router.post('/inf', asyncH(async (req, res) => res.json(engine.funcs().infection(req.body))));
router.post('/ped', asyncH(async (req, res) => res.json(engine.funcs().peds(req.body))));
module.exports = router;