// Hand-written engine — PCC 3.186.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.186.0';
const MOD = 'pcc_aortic_intervention';

function AorticAneurysmSizingExt(input) {
  const _i = input || {};
  const d = Number(_i.diameter || 40);
  let plan = 'surveillance';
  if (d >= 55) plan = 'repair-AAA';
  else if (d >= 50) plan = 'repair-consider';
  else if (d >= 45) plan = 'followup-1y';
  const _r = { plan, diameter: d };
  return Object.assign({ version: VER, module: MOD, function: 'AorticAneurysmSizingExt', input, ts: TS }, _r);
}

function EVARvsOpenRepairExt(input) {
  const _i = input || {};
  const _r = { recommendation: Number(_i.age || 70) > 70 && String(_i.anatomy || 'favorable') === 'favorable' ? 'EVAR' : 'open-repair' };
  return Object.assign({ version: VER, module: MOD, function: 'EVARvsOpenRepairExt', input, ts: TS }, _r);
}

function AorticDissectionStanfordExt(input) {
  const _i = input || {};
  const _r = { type: String(_i.ascending || 'no') === 'yes' ? 'A' : 'B' };
  return Object.assign({ version: VER, module: MOD, function: 'AorticDissectionStanfordExt', input, ts: TS }, _r);
}

function TypeBAorticDissectionMgtExt(input) {
  const _i = input || {};
  const _r = { plan: String(_i.complicated || 'no') === 'yes' ? 'TEVAR' : 'medical-mgmt' };
  return Object.assign({ version: VER, module: MOD, function: 'TypeBAorticDissectionMgtExt', input, ts: TS }, _r);
}

function MarfanSurveillanceExt(input) {
  const _i = input || {};
  const _r = { echo_interval_months: Number(_i.root || 35) >= 45 ? 6 : 12 };
  return Object.assign({ version: VER, module: MOD, function: 'MarfanSurveillanceExt', input, ts: TS }, _r);
}

function AorticCoarctationRepairExt(input) {
  const _i = input || {};
  const _r = { severe: Number(_i.gradient || 25) >= 20, gradient: Number(_i.gradient || 25) };
  return Object.assign({ version: VER, module: MOD, function: 'AorticCoarctationRepairExt', input, ts: TS }, _r);
}

function PADIClassificationExt(input) {
  const _i = input || {};
  const r = Number(_i.rutherford || 0);
  const s = ['asymptomatic', 'mild-claudication', 'moderate-claudication', 'severe-claudication', 'rest-pain', 'minor-tissue-loss', 'major-tissue-loss'];
  const _r = { stage: s[Math.min(r, 6)], rutherford: r };
  return Object.assign({ version: VER, module: MOD, function: 'PADIClassificationExt', input, ts: TS }, _r);
}

function ABIScreeningExt(input) {
  const _i = input || {};
  const a = Number(_i.abi || 1.0);
  let interp = 'normal';
  if (a <= 0.4) interp = 'severe-PAD';
  else if (a <= 0.9) interp = 'PAD';
  else if (a > 1.4) interp = 'non-compressible';
  const _r = { abi: a, interp };
  return Object.assign({ version: VER, module: MOD, function: 'ABIScreeningExt', input, ts: TS }, _r);
}

function CLITreatmentExt(input) {
  const _i = input || {};
  const w = String(_i.wound || 'no') === 'yes';
  const inf = String(_i.infection || 'no') === 'yes';
  const isc = String(_i.ischemia || 'no') === 'yes';
  let tier = 'none';
  if (isc && w && !inf) tier = 'revascularization';
  else if (inf) tier = 'infection-control';
  else if (w) tier = 'wound-care';
  const _r = { tier };
  return Object.assign({ version: VER, module: MOD, function: 'CLITreatmentExt', input, ts: TS }, _r);
}

function CarotidStenosisMgtExt(input) {
  const _i = input || {};
  const s = Number(_i.stenosis || 50);
  const sx = String(_i.symptomatic || 'no') === 'yes';
  let plan = 'medical';
  if (sx && s >= 50) plan = 'CEA-or-CAS';
  else if (!sx && s >= 60) plan = 'CEA-consider';
  const _r = { plan };
  return Object.assign({ version: VER, module: MOD, function: 'CarotidStenosisMgtExt', input, ts: TS }, _r);
}

module.exports = {
  AorticAneurysmSizingExt,
  EVARvsOpenRepairExt,
  AorticDissectionStanfordExt,
  TypeBAorticDissectionMgtExt,
  MarfanSurveillanceExt,
  AorticCoarctationRepairExt,
  PADIClassificationExt,
  ABIScreeningExt,
  CLITreatmentExt,
  CarotidStenosisMgtExt,
};