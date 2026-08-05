// Hand-written engine — PCC 3.186.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.186.0';
const MOD = 'pcc_peripheral_vascular';

function ABIDecisionExt(input) {
  const _i = input || {};
  const a = Number(_i.abi || 1.0);
  let plan = 'observe';
  if (a <= 0.4) plan = 'refer-vascular';
  else if (a <= 0.9) plan = 'structured-exercise';
  const _r = { plan };
  return Object.assign({ version: VER, module: MOD, function: 'ABIDecisionExt', input, ts: TS }, _r);
}

function ClaudicationMedTherapyExt(input) {
  const _i = input || {};
  const s = String(_i.supervised || 'no') === 'yes';
  const c = String(_i.cilostazol || 'no') === 'yes';
  const _r = { plan: s ? 'supervised-exercise' : c ? 'cilostazol' : 'risk-modification' };
  return Object.assign({ version: VER, module: MOD, function: 'ClaudicationMedTherapyExt', input, ts: TS }, _r);
}

function RevascularizationStrategyExt(input) {
  const _i = input || {};
  const l = String(_i.lesion_length || 'short');
  const t = String(_i.tasc || 'A');
  const _r = { approach: l === 'short' || t === 'A' || t === 'B' ? 'endovascular' : 'surgical-bypass' };
  return Object.assign({ version: VER, module: MOD, function: 'RevascularizationStrategyExt', input, ts: TS }, _r);
}

function RenalArteryStenosisMgtExt(input) {
  const _i = input || {};
  const r = String(_i.refractory_htn || 'no') === 'yes';
  const f = String(_i.flash_pulmonary_edema || 'no') === 'yes';
  const _r = { plan: (r || f) && Number(_i.stenosis || 50) >= 70 ? 'revascularization' : 'medical' };
  return Object.assign({ version: VER, module: MOD, function: 'RenalArteryStenosisMgtExt', input, ts: TS }, _r);
}

function FibromuscularDysplasiaScreeningExt(input) {
  const _i = input || {};
  const _r = { consider: Number(_i.age || 50) < 50 && String(_i.female || 'no') === 'yes' && String(_i.htn || 'no') === 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'FibromuscularDysplasiaScreeningExt', input, ts: TS }, _r);
}

function RaynaudsPhenomenonExt(input) {
  const _i = input || {};
  const asym = String(_i.asymmetric || 'no') === 'yes';
  const u = String(_i.ulcers || 'no') === 'yes';
  const age = Number(_i.age || 40);
  const _r = { type: !asym && !u && age >= 18 && age <= 40 ? 'primary' : 'secondary' };
  return Object.assign({ version: VER, module: MOD, function: 'RaynaudsPhenomenonExt', input, ts: TS }, _r);
}

function BuergersDiseaseCriteriaExt(input) {
  const _i = input || {};
  const _r = { criteria_met: String(_i.smoker || 'no') === 'yes' && Number(_i.age || 40) < 50 && String(_i.distal_involvement || 'no') === 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'BuergersDiseaseCriteriaExt', input, ts: TS }, _r);
}

function LymphedemaStagingExt(input) {
  const _i = input || {};
  const s = ['0-asymptomatic', '1-reversible', '2-irreversible', '3-elephantiasis'];
  const _r = { stage_label: s[Math.min(Number(_i.stage || 0), 3)] };
  return Object.assign({ version: VER, module: MOD, function: 'LymphedemaStagingExt', input, ts: TS }, _r);
}

function CompressionStockingsClassExt(input) {
  const _i = input || {};
  const sev = String(_i.severity || 'mild');
  const _r = { class: sev === 'severe' ? 3 : sev === 'moderate' ? 2 : 1 };
  return Object.assign({ version: VER, module: MOD, function: 'CompressionStockingsClassExt', input, ts: TS }, _r);
}

function WoundCareVascularExt(input) {
  const _i = input || {};
  const _r = { healing_likely: Number(_i.abi || 1.0) > 0.5 || String(_i.revascularized || 'no') === 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'WoundCareVascularExt', input, ts: TS }, _r);
}

module.exports = {
  ABIDecisionExt,
  ClaudicationMedTherapyExt,
  RevascularizationStrategyExt,
  RenalArteryStenosisMgtExt,
  FibromuscularDysplasiaScreeningExt,
  RaynaudsPhenomenonExt,
  BuergersDiseaseCriteriaExt,
  LymphedemaStagingExt,
  CompressionStockingsClassExt,
  WoundCareVascularExt,
};