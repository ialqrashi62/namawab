'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ob_delivery_106_neonatal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/apgar', asyncH((req, res) => res.json(engine.apgarScore(req.body))));
router.post('/resusc', asyncH((req, res) => res.json(engine.neonatalResuscitation(req.body))));
module.exports = router;