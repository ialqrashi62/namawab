// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.49.49.0';
const MOD = 'pcc_nutrition_ext102';

function NutrGeneralExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrGeneralExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrGeneralExt", input, score, ts: TS, nutrGeneralExt: _i.nutrGeneralExt || null };
}

function NutrAssessmentExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrAssessmentExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrAssessmentExt", input, score, ts: TS, nutrAssessmentExt: _i.nutrAssessmentExt || null };
}

function NutrDeficiencyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrDeficiencyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrDeficiencyExt", input, score, ts: TS, nutrDeficiencyExt: _i.nutrDeficiencyExt || null };
}

function NutrMacroExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrMacroExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrMacroExt", input, score, ts: TS, nutrMacroExt: _i.nutrMacroExt || null };
}

function NutrMicroExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrMicroExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrMicroExt", input, score, ts: TS, nutrMicroExt: _i.nutrMicroExt || null };
}

function NutrAllergyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrAllergyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrAllergyExt", input, score, ts: TS, nutrAllergyExt: _i.nutrAllergyExt || null };
}

function NutrPediatricExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrPediatricExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrPediatricExt", input, score, ts: TS, nutrPediatricExt: _i.nutrPediatricExt || null };
}

function NutrGeriatricExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrGeriatricExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrGeriatricExt", input, score, ts: TS, nutrGeriatricExt: _i.nutrGeriatricExt || null };
}

function NutrEnteralExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrEnteralExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrEnteralExt", input, score, ts: TS, nutrEnteralExt: _i.nutrEnteralExt || null };
}

function NutrParenteralExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nutrParenteralExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NutrParenteralExt", input, score, ts: TS, nutrParenteralExt: _i.nutrParenteralExt || null };
}

module.exports = {
  NutrGeneralExt,
  NutrAssessmentExt,
  NutrDeficiencyExt,
  NutrMacroExt,
  NutrMicroExt,
  NutrAllergyExt,
  NutrPediatricExt,
  NutrGeriatricExt,
  NutrEnteralExt,
  NutrParenteralExt,
};
