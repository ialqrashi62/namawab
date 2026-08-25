'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urol_106_functional_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/incontinence', asyncH((req, res) => res.json(engine.stressIncontinence(req.body))));
router.post('/ic', asyncH((req, res) => res.json(engine.interstitialCystitis(req.body))));
module.exports = router;