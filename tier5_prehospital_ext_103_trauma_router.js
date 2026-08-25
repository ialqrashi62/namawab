// filepath: tier5_prehospital_ext_103_trauma_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_prehospital_ext_103_trauma_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/mech', asyncH(async (req, res) => res.json(engine.funcs().mechanism(req.body))));
router.post('/anat', asyncH(async (req, res) => res.json(engine.funcs().anatomy(req.body))));
router.post('/vit', asyncH(async (req, res) => res.json(engine.funcs().vitals_cdc(req.body))));
router.post('/spec', asyncH(async (req, res) => res.json(engine.funcs().special(req.body))));
router.post('/stop', asyncH(async (req, res) => res.json(engine.funcs().stop(req.body))));
router.post('/dest', asyncH(async (req, res) => res.json(engine.funcs().destination(req.body))));
module.exports = router;
