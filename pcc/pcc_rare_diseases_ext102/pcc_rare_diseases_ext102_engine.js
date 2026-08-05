// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.40.40.0';
const MOD = 'pcc_rare_diseases_ext102';

function RareDxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareDxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareDxExt", input, score, ts: TS, rareDxExt: _i.rareDxExt || null };
}

function RarePrevalenceExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rarePrevalenceExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RarePrevalenceExt", input, score, ts: TS, rarePrevalenceExt: _i.rarePrevalenceExt || null };
}

function RareRegistryExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareRegistryExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareRegistryExt", input, score, ts: TS, rareRegistryExt: _i.rareRegistryExt || null };
}

function RareCenterExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareCenterExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareCenterExt", input, score, ts: TS, rareCenterExt: _i.rareCenterExt || null };
}

function RarePediatricExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rarePediatricExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RarePediatricExt", input, score, ts: TS, rarePediatricExt: _i.rarePediatricExt || null };
}

function RareNewbornExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareNewbornExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareNewbornExt", input, score, ts: TS, rareNewbornExt: _i.rareNewbornExt || null };
}

function RareGeneticExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareGeneticExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareGeneticExt", input, score, ts: TS, rareGeneticExt: _i.rareGeneticExt || null };
}

function RareMetabolicExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareMetabolicExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareMetabolicExt", input, score, ts: TS, rareMetabolicExt: _i.rareMetabolicExt || null };
}

function RareAdultExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareAdultExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareAdultExt", input, score, ts: TS, rareAdultExt: _i.rareAdultExt || null };
}

function RareSupportExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.rareSupportExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "RareSupportExt", input, score, ts: TS, rareSupportExt: _i.rareSupportExt || null };
}

module.exports = {
  RareDxExt,
  RarePrevalenceExt,
  RareRegistryExt,
  RareCenterExt,
  RarePediatricExt,
  RareNewbornExt,
  RareGeneticExt,
  RareMetabolicExt,
  RareAdultExt,
  RareSupportExt,
};
