// filepath: tier5_oph_ext_106_oculo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_106_oculo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/lid', asyncH(async (req, res) => res.json(engine.funcs().eyelid(req.body))));
router.post('/orb', asyncH(async (req, res) => res.json(engine.funcs().orbit(req.body))));
router.post('/lac', asyncH(async (req, res) => res.json(engine.funcs().lacrimal(req.body))));
router.post('/pup', asyncH(async (req, res) => res.json(engine.funcs().pupil(req.body))));
router.post('/on', asyncH(async (req, res) => res.json(engine.funcs().optic_neuritis(req.body))));
router.post('/pe', asyncH(async (req, res) => res.json(engine.funcs().papilledema(req.body))));
module.exports = router;