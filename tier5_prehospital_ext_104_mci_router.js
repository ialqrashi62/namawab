// filepath: tier5_prehospital_ext_104_mci_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_prehospital_ext_104_mci_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/tri', asyncH(async (req, res) => res.json(engine.funcs().triage(req.body))));
router.post('/ic', asyncH(async (req, res) => res.json(engine.funcs().incident_command(req.body))));
router.post('/stg', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/comm', asyncH(async (req, res) => res.json(engine.funcs().communication(req.body))));
router.post('/res', asyncH(async (req, res) => res.json(engine.funcs().resources(req.body))));
router.post('/demob', asyncH(async (req, res) => res.json(engine.funcs().demobilization(req.body))));
module.exports = router;
