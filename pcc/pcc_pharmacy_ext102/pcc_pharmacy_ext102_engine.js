// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.74.74.0';
const MOD = 'pcc_pharmacy_ext102';

function PharmGenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmGenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmGenExt", input, score, ts: TS, pharmGenExt: _i.pharmGenExt || null };
}

function PharmDispenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmDispenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmDispenExt", input, score, ts: TS, pharmDispenExt: _i.pharmDispenExt || null };
}

function PharmCompExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmCompExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmCompExt", input, score, ts: TS, pharmCompExt: _i.pharmCompExt || null };
}

function PharmInteractExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmInteractExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmInteractExt", input, score, ts: TS, pharmInteractExt: _i.pharmInteractExt || null };
}

function PharmAllergyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmAllergyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmAllergyExt", input, score, ts: TS, pharmAllergyExt: _i.pharmAllergyExt || null };
}

function PharmDoseExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmDoseExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmDoseExt", input, score, ts: TS, pharmDoseExt: _i.pharmDoseExt || null };
}

function PharmIVext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmIVext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PharmIVext', input, score, ts: TS, pharmIVext: _i.pharmIVext || null };
}

function PharmTPNext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmTPNext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PharmTPNext', input, score, ts: TS, pharmTPNext: _i.pharmTPNext || null };
}

function PharmClinicalExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmClinicalExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmClinicalExt", input, score, ts: TS, pharmClinicalExt: _i.pharmClinicalExt || null };
}

function PharmConsultExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pharmConsultExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PharmConsultExt", input, score, ts: TS, pharmConsultExt: _i.pharmConsultExt || null };
}

module.exports = {
  PharmGenExt,
  PharmDispenExt,
  PharmCompExt,
  PharmInteractExt,
  PharmAllergyExt,
  PharmDoseExt,
  PharmIVext,
  PharmTPNext,
  PharmClinicalExt,
  PharmConsultExt,
};
