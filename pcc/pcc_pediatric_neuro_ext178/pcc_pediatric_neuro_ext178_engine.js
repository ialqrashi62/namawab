// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.18.18.0';
const MOD = 'pcc_pediatric_neuro_ext178';

function PediatricSCIext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSCIext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricSCIext', input, score, ts: TS, pediatricSCIext: _i.pediatricSCIext || null };
}

function PediatricSpinaBifidaNeuroExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSpinaBifidaNeuroExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSpinaBifidaNeuroExt", input, score, ts: TS, pediatricSpinaBifidaNeuroExt: _i.pediatricSpinaBifidaNeuroExt || null };
}

function PediatricNeuroBladderExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricNeuroBladderExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricNeuroBladderExt", input, score, ts: TS, pediatricNeuroBladderExt: _i.pediatricNeuroBladderExt || null };
}

function PediatricNeuroBowelExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricNeuroBowelExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricNeuroBowelExt", input, score, ts: TS, pediatricNeuroBowelExt: _i.pediatricNeuroBowelExt || null };
}

function PediatricSCIrehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSCIrehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSCIrehabExt", input, score, ts: TS, pediatricSCIrehabExt: _i.pediatricSCIrehabExt || null };
}

function PediatricADpedExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricADpedExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricADpedExt", input, score, ts: TS, pediatricADpedExt: _i.pediatricADpedExt || null };
}

function PediatricPressureUlcerExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPressureUlcerExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPressureUlcerExt", input, score, ts: TS, pediatricPressureUlcerExt: _i.pediatricPressureUlcerExt || null };
}

function PediatricSCIpsyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSCIpsyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSCIpsyExt", input, score, ts: TS, pediatricSCIpsyExt: _i.pediatricSCIpsyExt || null };
}

function PediatricSCItransExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSCItransExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSCItransExt", input, score, ts: TS, pediatricSCItransExt: _i.pediatricSCItransExt || null };
}

function PediatricSCIfollowExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSCIfollowExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSCIfollowExt", input, score, ts: TS, pediatricSCIfollowExt: _i.pediatricSCIfollowExt || null };
}

module.exports = {
  PediatricSCIext,
  PediatricSpinaBifidaNeuroExt,
  PediatricNeuroBladderExt,
  PediatricNeuroBowelExt,
  PediatricSCIrehabExt,
  PediatricADpedExt,
  PediatricPressureUlcerExt,
  PediatricSCIpsyExt,
  PediatricSCItransExt,
  PediatricSCIfollowExt,
};
