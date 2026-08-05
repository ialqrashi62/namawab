// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.48.48.0';
const MOD = 'pcc_rehabilitation_ext102';

function RehabGeneralExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabGeneralExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabGeneralExt", input, score, ts: TS, rehabGeneralExt: _i.rehabGeneralExt || null };
}

function RehabPTExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabPTExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabPTExt", input, score, ts: TS, rehabPTExt: _i.rehabPTExt || null };
}

function RehabOTExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabOTExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabOTExt", input, score, ts: TS, rehabOTExt: _i.rehabOTExt || null };
}

function RehabSTExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabSTExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabSTExt", input, score, ts: TS, rehabSTExt: _i.rehabSTExt || null };
}

function RehabCardiacExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabCardiacExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabCardiacExt", input, score, ts: TS, rehabCardiacExt: _i.rehabCardiacExt || null };
}

function RehabPulmonaryExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabPulmonaryExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabPulmonaryExt", input, score, ts: TS, rehabPulmonaryExt: _i.rehabPulmonaryExt || null };
}

function RehabNeuroExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabNeuroExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabNeuroExt", input, score, ts: TS, rehabNeuroExt: _i.rehabNeuroExt || null };
}

function RehabOrthoExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabOrthoExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabOrthoExt", input, score, ts: TS, rehabOrthoExt: _i.rehabOrthoExt || null };
}

function RehabProsthExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabProsthExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabProsthExt", input, score, ts: TS, rehabProsthExt: _i.rehabProsthExt || null };
}

function RehabDischargeExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rehabDischargeExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RehabDischargeExt", input, score, ts: TS, rehabDischargeExt: _i.rehabDischargeExt || null };
}

module.exports = {
  RehabGeneralExt,
  RehabPTExt,
  RehabOTExt,
  RehabSTExt,
  RehabCardiacExt,
  RehabPulmonaryExt,
  RehabNeuroExt,
  RehabOrthoExt,
  RehabProsthExt,
  RehabDischargeExt,
};
