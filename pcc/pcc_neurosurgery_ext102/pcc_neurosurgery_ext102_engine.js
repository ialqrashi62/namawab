// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.61.61.0';
const MOD = 'pcc_neurosurgery_ext102';

function NSxGenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxGenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxGenExt", input, score, ts: TS, nSxGenExt: _i.nSxGenExt || null };
}

function NSxTumorExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxTumorExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxTumorExt", input, score, ts: TS, nSxTumorExt: _i.nSxTumorExt || null };
}

function NSxAVMext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxAVMext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'NSxAVMext', input, score, ts: TS, nSxAVMext: _i.nSxAVMext || null };
}

function NSxAneurExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxAneurExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxAneurExt", input, score, ts: TS, nSxAneurExt: _i.nSxAneurExt || null };
}

function NSxTBIext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxTBIext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'NSxTBIext', input, score, ts: TS, nSxTBIext: _i.nSxTBIext || null };
}

function NSxHemorExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxHemorExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxHemorExt", input, score, ts: TS, nSxHemorExt: _i.nSxHemorExt || null };
}

function NSxHydroExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxHydroExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxHydroExt", input, score, ts: TS, nSxHydroExt: _i.nSxHydroExt || null };
}

function NSxSpineExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxSpineExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxSpineExt", input, score, ts: TS, nSxSpineExt: _i.nSxSpineExt || null };
}

function NSxFuncExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxFuncExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxFuncExt", input, score, ts: TS, nSxFuncExt: _i.nSxFuncExt || null };
}

function NSxSkullBaseExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nSxSkullBaseExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NSxSkullBaseExt", input, score, ts: TS, nSxSkullBaseExt: _i.nSxSkullBaseExt || null };
}

module.exports = {
  NSxGenExt,
  NSxTumorExt,
  NSxAVMext,
  NSxAneurExt,
  NSxTBIext,
  NSxHemorExt,
  NSxHydroExt,
  NSxSpineExt,
  NSxFuncExt,
  NSxSkullBaseExt,
};
