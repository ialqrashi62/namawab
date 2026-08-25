'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ob_delivery_103_analgesia_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/epidural', asyncH((req, res) => res.json(engine.epiduralEligibility(req.body))));
router.post('/recommend', asyncH((req, res) => res.json(engine.nlbVsEpidural(req.body))));
module.exports = router;