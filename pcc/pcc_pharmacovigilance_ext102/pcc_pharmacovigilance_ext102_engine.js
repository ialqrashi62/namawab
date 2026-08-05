// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.40.40.0';
const MOD = 'pcc_pharmacovigilance_ext102';

function PVReportingExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVReportingExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVReportingExt", input, score, ts: TS, pVReportingExt: _i.pVReportingExt || null };
}

function PVSignalExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVSignalExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVSignalExt", input, score, ts: TS, pVSignalExt: _i.pVSignalExt || null };
}

function PVADRadultExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVADRadultExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVADRadultExt", input, score, ts: TS, pVADRadultExt: _i.pVADRadultExt || null };
}

function PVPeriodicExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVPeriodicExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVPeriodicExt", input, score, ts: TS, pVPeriodicExt: _i.pVPeriodicExt || null };
}

function PVRiskMgmtExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVRiskMgmtExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVRiskMgmtExt", input, score, ts: TS, pVRiskMgmtExt: _i.pVRiskMgmtExt || null };
}

function PVVaccineExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVVaccineExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVVaccineExt", input, score, ts: TS, pVVaccineExt: _i.pVVaccineExt || null };
}

function PVDeviceExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVDeviceExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVDeviceExt", input, score, ts: TS, pVDeviceExt: _i.pVDeviceExt || null };
}

function PVMedErrorExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVMedErrorExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVMedErrorExt", input, score, ts: TS, pVMedErrorExt: _i.pVMedErrorExt || null };
}

function PVLackEfficacyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVLackEfficacyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVLackEfficacyExt", input, score, ts: TS, pVLackEfficacyExt: _i.pVLackEfficacyExt || null };
}

function PVPregnancyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pVPregnancyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PVPregnancyExt", input, score, ts: TS, pVPregnancyExt: _i.pVPregnancyExt || null };
}

module.exports = {
  PVReportingExt,
  PVSignalExt,
  PVADRadultExt,
  PVPeriodicExt,
  PVRiskMgmtExt,
  PVVaccineExt,
  PVDeviceExt,
  PVMedErrorExt,
  PVLackEfficacyExt,
  PVPregnancyExt,
};
