// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.1.8.0';
const MOD = 'pcc_pediatric_neuro_ext168';

function PediatricCIMText(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCIMText) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricCIMText', input, score, ts: TS, pediatricCIMText: _i.pediatricCIMText || null };
}

function PediatricCPRehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCPRehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCPRehabExt", input, score, ts: TS, pediatricCPRehabExt: _i.pediatricCPRehabExt || null };
}

function PediatricNeurorehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricNeurorehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricNeurorehabExt", input, score, ts: TS, pediatricNeurorehabExt: _i.pediatricNeurorehabExt || null };
}

function PediatricRobotRehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricRobotRehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricRobotRehabExt", input, score, ts: TS, pediatricRobotRehabExt: _i.pediatricRobotRehabExt || null };
}

function PediatricVRrehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricVRrehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricVRrehabExt", input, score, ts: TS, pediatricVRrehabExt: _i.pediatricVRrehabExt || null };
}

function PediatricTelerehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTelerehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTelerehabExt", input, score, ts: TS, pediatricTelerehabExt: _i.pediatricTelerehabExt || null };
}

function PediatricSpasticityMgtExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSpasticityMgtExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSpasticityMgtExt", input, score, ts: TS, pediatricSpasticityMgtExt: _i.pediatricSpasticityMgtExt || null };
}

function PediatricDysphagiaMgtExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDysphagiaMgtExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDysphagiaMgtExt", input, score, ts: TS, pediatricDysphagiaMgtExt: _i.pediatricDysphagiaMgtExt || null };
}

function PediatricConstraintExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricConstraintExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricConstraintExt", input, score, ts: TS, pediatricConstraintExt: _i.pediatricConstraintExt || null };
}

function PediatricHandTherapyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricHandTherapyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricHandTherapyExt", input, score, ts: TS, pediatricHandTherapyExt: _i.pediatricHandTherapyExt || null };
}

module.exports = {
  PediatricCIMText,
  PediatricCPRehabExt,
  PediatricNeurorehabExt,
  PediatricRobotRehabExt,
  PediatricVRrehabExt,
  PediatricTelerehabExt,
  PediatricSpasticityMgtExt,
  PediatricDysphagiaMgtExt,
  PediatricConstraintExt,
  PediatricHandTherapyExt,
};
