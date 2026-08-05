// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.40.40.0';
const MOD = 'pcc_orphan_drugs_ext102';

function OrphanDesignationExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanDesignationExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanDesignationExt", input, score, ts: TS, orphanDesignationExt: _i.orphanDesignationExt || null };
}

function OrphanAccessExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanAccessExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanAccessExt", input, score, ts: TS, orphanAccessExt: _i.orphanAccessExt || null };
}

function OrphanCostExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanCostExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanCostExt", input, score, ts: TS, orphanCostExt: _i.orphanCostExt || null };
}

function OrphanTrialExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanTrialExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanTrialExt", input, score, ts: TS, orphanTrialExt: _i.orphanTrialExt || null };
}

function OrphanSurrogateExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanSurrogateExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanSurrogateExt", input, score, ts: TS, orphanSurrogateExt: _i.orphanSurrogateExt || null };
}

function OrphanCompassionateExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanCompassionateExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanCompassionateExt", input, score, ts: TS, orphanCompassionateExt: _i.orphanCompassionateExt || null };
}

function OrphanRegistryExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanRegistryExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanRegistryExt", input, score, ts: TS, orphanRegistryExt: _i.orphanRegistryExt || null };
}

function OrphanPediatricExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanPediatricExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanPediatricExt", input, score, ts: TS, orphanPediatricExt: _i.orphanPediatricExt || null };
}

function OrphanGeneticExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanGeneticExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanGeneticExt", input, score, ts: TS, orphanGeneticExt: _i.orphanGeneticExt || null };
}

function OrphanApprovalExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.orphanApprovalExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "OrphanApprovalExt", input, score, ts: TS, orphanApprovalExt: _i.orphanApprovalExt || null };
}

module.exports = {
  OrphanDesignationExt,
  OrphanAccessExt,
  OrphanCostExt,
  OrphanTrialExt,
  OrphanSurrogateExt,
  OrphanCompassionateExt,
  OrphanRegistryExt,
  OrphanPediatricExt,
  OrphanGeneticExt,
  OrphanApprovalExt,
};
