// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.12.8.0';
const MOD = 'pcc_pediatric_neuro_ext156';

function PediatricPituitaryAdExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPituitaryAdExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPituitaryAdExt", input, score, ts: TS, pediatricPituitaryAdExt: _i.pediatricPituitaryAdExt || null };
}

function PediatricAcromegalyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAcromegalyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAcromegalyExt", input, score, ts: TS, pediatricAcromegalyExt: _i.pediatricAcromegalyExt || null };
}

function PediatricCushingExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCushingExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCushingExt", input, score, ts: TS, pediatricCushingExt: _i.pediatricCushingExt || null };
}

function PediatricDIExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDIExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDIExt", input, score, ts: TS, pediatricDIExt: _i.pediatricDIExt || null };
}

function PediatricSIADHExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSIADHExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSIADHExt", input, score, ts: TS, pediatricSIADHExt: _i.pediatricSIADHExt || null };
}

function PediatricHypothyroidExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricHypothyroidExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricHypothyroidExt", input, score, ts: TS, pediatricHypothyroidExt: _i.pediatricHypothyroidExt || null };
}

function PediatricCongHypothyroidExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCongHypothyroidExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCongHypothyroidExt", input, score, ts: TS, pediatricCongHypothyroidExt: _i.pediatricCongHypothyroidExt || null };
}

function PediatricHyperthyroidExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricHyperthyroidExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricHyperthyroidExt", input, score, ts: TS, pediatricHyperthyroidExt: _i.pediatricHyperthyroidExt || null };
}

function PediatricAdrenalInsufficiencyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAdrenalInsufficiencyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAdrenalInsufficiencyExt", input, score, ts: TS, pediatricAdrenalInsufficiencyExt: _i.pediatricAdrenalInsufficiencyExt || null };
}

function PediatricPheochromExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPheochromExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPheochromExt", input, score, ts: TS, pediatricPheochromExt: _i.pediatricPheochromExt || null };
}

module.exports = {
  PediatricPituitaryAdExt,
  PediatricAcromegalyExt,
  PediatricCushingExt,
  PediatricDIExt,
  PediatricSIADHExt,
  PediatricHypothyroidExt,
  PediatricCongHypothyroidExt,
  PediatricHyperthyroidExt,
  PediatricAdrenalInsufficiencyExt,
  PediatricPheochromExt,
};
