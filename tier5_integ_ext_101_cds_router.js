'use strict';
const express = require('express');
const engine = require('./tier5_integ_ext_101_cds_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/hook_patient_view', asyncH((req, res) => res.json(engine.hook_patient_view(req.body || {}))));
r.post('/hook_order_sign', asyncH((req, res) => res.json(engine.hook_order_sign(req.body || {}))));
r.post('/hook_medication_prescribe', asyncH((req, res) => res.json(engine.hook_medication_prescribe(req.body || {}))));
module.exports = r;