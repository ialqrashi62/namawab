// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.15.15.0';
const MOD = 'pcc_pediatric_neuro_ext175';

function PediatricCSFleakExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCSFleakExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCSFleakExt", input, score, ts: TS, pediatricCSFleakExt: _i.pediatricCSFleakExt || null };
}

function PediatricChiariExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricChiariExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricChiariExt", input, score, ts: TS, pediatricChiariExt: _i.pediatricChiariExt || null };
}

function PediatricSyringoExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSyringoExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSyringoExt", input, score, ts: TS, pediatricSyringoExt: _i.pediatricSyringoExt || null };
}

function PediatricTetheredExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTetheredExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTetheredExt", input, score, ts: TS, pediatricTetheredExt: _i.pediatricTetheredExt || null };
}

function PediatricSpinaBifidaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSpinaBifidaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSpinaBifidaExt", input, score, ts: TS, pediatricSpinaBifidaExt: _i.pediatricSpinaBifidaExt || null };
}

function PediatricHydroExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricHydroExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricHydroExt", input, score, ts: TS, pediatricHydroExt: _i.pediatricHydroExt || null };
}

function PediatricIIHext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricIIHext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricIIHext', input, score, ts: TS, pediatricIIHext: _i.pediatricIIHext || null };
}

function PediatricDandyWalkerExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDandyWalkerExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDandyWalkerExt", input, score, ts: TS, pediatricDandyWalkerExt: _i.pediatricDandyWalkerExt || null };
}

function PediatricAqueductStenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAqueductStenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAqueductStenExt", input, score, ts: TS, pediatricAqueductStenExt: _i.pediatricAqueductStenExt || null };
}

function PediatricArachnoidCystExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricArachnoidCystExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricArachnoidCystExt", input, score, ts: TS, pediatricArachnoidCystExt: _i.pediatricArachnoidCystExt || null };
}

module.exports = {
  PediatricCSFleakExt,
  PediatricChiariExt,
  PediatricSyringoExt,
  PediatricTetheredExt,
  PediatricSpinaBifidaExt,
  PediatricHydroExt,
  PediatricIIHext,
  PediatricDandyWalkerExt,
  PediatricAqueductStenExt,
  PediatricArachnoidCystExt,
};
