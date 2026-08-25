'use strict';
const express = require('express');
const engine = require('./tier5_integ_ext_102_fhir_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/patient', asyncH((req, res) => res.json(engine.patient_map(req.body || {}))));
r.post('/observation', asyncH((req, res) => res.json(engine.observation_map(req.body || {}))));
r.post('/bundle', asyncH((req, res) => res.json(engine.bundle_construct(req.body || {}))));
module.exports = r;