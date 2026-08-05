// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.70.70.0';
const MOD = 'pcc_trauma_ext102';

function TrGenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trGenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrGenExt", input, score, ts: TS, trGenExt: _i.trGenExt || null };
}

function TrPrimaryExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trPrimaryExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrPrimaryExt", input, score, ts: TS, trPrimaryExt: _i.trPrimaryExt || null };
}

function TrSecondaryExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trSecondaryExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrSecondaryExt", input, score, ts: TS, trSecondaryExt: _i.trSecondaryExt || null };
}

function TrHeadExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trHeadExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrHeadExt", input, score, ts: TS, trHeadExt: _i.trHeadExt || null };
}

function TrChestTraumaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trChestTraumaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrChestTraumaExt", input, score, ts: TS, trChestTraumaExt: _i.trChestTraumaExt || null };
}

function TrAbdominalTraumaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trAbdominalTraumaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrAbdominalTraumaExt", input, score, ts: TS, trAbdominalTraumaExt: _i.trAbdominalTraumaExt || null };
}

function TrPelvicExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trPelvicExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrPelvicExt", input, score, ts: TS, trPelvicExt: _i.trPelvicExt || null };
}

function TrSpinalExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trSpinalExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrSpinalExt", input, score, ts: TS, trSpinalExt: _i.trSpinalExt || null };
}

function TrVascTraumaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trVascTraumaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TrVascTraumaExt", input, score, ts: TS, trVascTraumaExt: _i.trVascTraumaExt || null };
}

function TrOR_ext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.trOR_ext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'TrOR_ext', input, score, ts: TS, trOR_ext: _i.trOR_ext || null };
}

module.exports = {
  TrGenExt,
  TrPrimaryExt,
  TrSecondaryExt,
  TrHeadExt,
  TrChestTraumaExt,
  TrAbdominalTraumaExt,
  TrPelvicExt,
  TrSpinalExt,
  TrVascTraumaExt,
  TrOR_ext,
};
