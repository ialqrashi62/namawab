'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_104_biliary_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/choledocholithiasis', asyncH((req, res) => res.json(engine.choledocholithiasis(req.body))));
router.post('/cholecystitis', asyncH((req, res) => res.json(engine.acuteCholecystitis(req.body))));
router.post('/psc', asyncH((req, res) => res.json(engine.primarySclerosingCholangitis(req.body))));
module.exports = router;