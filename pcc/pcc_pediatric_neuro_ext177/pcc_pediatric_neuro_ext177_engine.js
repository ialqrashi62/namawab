// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.17.17.0';
const MOD = 'pcc_pediatric_neuro_ext177';

function PediatricMovementDrugExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricMovementDrugExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricMovementDrugExt", input, score, ts: TS, pediatricMovementDrugExt: _i.pediatricMovementDrugExt || null };
}

function PediatricBotulinumExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricBotulinumExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricBotulinumExt", input, score, ts: TS, pediatricBotulinumExt: _i.pediatricBotulinumExt || null };
}

function PediatricDBSext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDBSext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricDBSext', input, score, ts: TS, pediatricDBSext: _i.pediatricDBSext || null };
}

function PediatricITBext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricITBext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricITBext', input, score, ts: TS, pediatricITBext: _i.pediatricITBext || null };
}

function PediatricDystoniaRxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDystoniaRxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDystoniaRxExt", input, score, ts: TS, pediatricDystoniaRxExt: _i.pediatricDystoniaRxExt || null };
}

function PediatricChoreaRxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricChoreaRxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricChoreaRxExt", input, score, ts: TS, pediatricChoreaRxExt: _i.pediatricChoreaRxExt || null };
}

function PediatricTicRxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTicRxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTicRxExt", input, score, ts: TS, pediatricTicRxExt: _i.pediatricTicRxExt || null };
}

function PediatricAtaxiaRxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAtaxiaRxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAtaxiaRxExt", input, score, ts: TS, pediatricAtaxiaRxExt: _i.pediatricAtaxiaRxExt || null };
}

function PediatricMyoclonusRxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricMyoclonusRxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricMyoclonusRxExt", input, score, ts: TS, pediatricMyoclonusRxExt: _i.pediatricMyoclonusRxExt || null };
}

function PediatricTremorRxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTremorRxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTremorRxExt", input, score, ts: TS, pediatricTremorRxExt: _i.pediatricTremorRxExt || null };
}

module.exports = {
  PediatricMovementDrugExt,
  PediatricBotulinumExt,
  PediatricDBSext,
  PediatricITBext,
  PediatricDystoniaRxExt,
  PediatricChoreaRxExt,
  PediatricTicRxExt,
  PediatricAtaxiaRxExt,
  PediatricMyoclonusRxExt,
  PediatricTremorRxExt,
};
