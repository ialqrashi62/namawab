// Hand-written engine — PCC 3.184.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.184.0';
const MOD = 'pcc_advanced_heart_failure';

function HeartFailureStageAssessmentExt(input) {
  const _i = input || {};
  const ef = Number(_i.ef || 50);
  const sym = String(_i.symptoms || 'none');
  let stage = 'A';
  if (ef < 40) stage = 'C-HFrEF';
  else if (ef < 50) stage = 'C-HFmrEF';
  else if (sym === 'dyspnea' || sym === 'fatigue') stage = 'C-HFpEF';
  else if (ef >= 50 && sym === 'none' && (_i.risk || 0) > 0) stage = 'B';
  const _r = { stage };
  return Object.assign({ version: VER, module: MOD, function: 'HeartFailureStageAssessmentExt', input, ts: TS }, _r);
}

function GDMTOptimizationExt(input) {
  const _i = input || {};
  const pillars = ['ARNI', 'Beta-blocker', 'MRA', 'SGLT2i'];
  const prescribed = Number(_i.prescribed || 0);
  const _r = { score: Math.round(Math.min(1, prescribed / 4) * 100) / 100, missing: pillars.slice(prescribed) };
  return Object.assign({ version: VER, module: MOD, function: 'GDMTOptimizationExt', input, ts: TS }, _r);
}

function LVADCandidateSelectionExt(input) {
  const _i = input || {};
  const eligible = Number(_i.age || 60) < 75 && Number(_i.ef || 25) < 25 && String(_i.inotropes || 'no') === 'yes';
  const _r = { eligible, recommendation: eligible ? 'refer-LVAD' : 'continue-medical' };
  return Object.assign({ version: VER, module: MOD, function: 'LVADCandidateSelectionExt', input, ts: TS }, _r);
}

function HeartTransplantListingExt(input) {
  const _i = input || {};
  const criteria = ['age_ok', 'no_active_infection', 'no_recent_cancer', 'psr_ok', 'compliance_ok'];
  const met = criteria.filter(c => String(_i[c] || 'no') === 'yes').length;
  const _r = { score: Math.round((met / criteria.length) * 100) / 100, met, criteria };
  return Object.assign({ version: VER, module: MOD, function: 'HeartTransplantListingExt', input, ts: TS }, _r);
}

function CardioMemsHDExt(input) {
  const _i = input || {};
  const pap = Number(_i.pap_diastolic || 12);
  let risk = 'low';
  if (pap > 20) risk = 'high';
  else if (pap > 15) risk = 'moderate';
  const _r = { pap_diastolic: pap, risk };
  return Object.assign({ version: VER, module: MOD, function: 'CardioMemsHDExt', input, ts: TS }, _r);
}

function InotropeWeaningProtocolExt(input) {
  const _i = input || {};
  const stable = Number(_i.ci || 2.5) >= 2.2 && Number(_i.svr || 1200) <= 1400;
  const _r = { stable, next_step: stable ? 'wean-10pct' : 'hold-dose' };
  return Object.assign({ version: VER, module: MOD, function: 'InotropeWeaningProtocolExt', input, ts: TS }, _r);
}

function PalliativeHFConsultExt(input) {
  const _i = input || {};
  const stage = String(_i.stage || 'C');
  const triggers = ['stage_D', 'frequent_admits', 'ltv_vent', 'inotrope_dependent'];
  const triggered = triggers.filter(t => String(_i[t] || 'no') === 'yes').length;
  const _r = { score: triggered / triggers.length, triggered, stage };
  return Object.assign({ version: VER, module: MOD, function: 'PalliativeHFConsultExt', input, ts: TS }, _r);
}

function HFReadmissionRiskExt(input) {
  const _i = input || {};
  const factors = ['prior_admit_30d', 'high_bnp', 'low_sodium', 'high_bun', 'poor_adherence'];
  const count = factors.filter(f => String(_i[f] || 'no') === 'yes').length;
  const _r = { risk: count >= 3 ? 'high' : count >= 1 ? 'moderate' : 'low', factors_positive: count };
  return Object.assign({ version: VER, module: MOD, function: 'HFReadmissionRiskExt', input, ts: TS }, _r);
}

function AmyloidCardiomyopathyScreenExt(input) {
  const _i = input || {};
  const features = ['lv_wall_thick', 'low_voltage_ecg', 'apical_sparing', 'age_over_65', 'hfpef'];
  const positives = features.filter(f => String(_i[f] || 'no') === 'yes').length;
  const _r = { screen_positive: positives >= 2, positives, next: positives >= 2 ? 'pyro-lights-and-biopsy' : 'reassure' };
  return Object.assign({ version: VER, module: MOD, function: 'AmyloidCardiomyopathyScreenExt', input, ts: TS }, _r);
}

function CRTResponsePredictionExt(input) {
  const _i = input || {};
  const favorable = String(_i.lbbb || 'no') === 'yes' && Number(_i.ef || 25) <= 35 && Number(_i.qrs_ms || 120) >= 150;
  const _r = { favorable, score: Math.round((favorable ? 0.9 : 0.4) * 100) / 100 };
  return Object.assign({ version: VER, module: MOD, function: 'CRTResponsePredictionExt', input, ts: TS }, _r);
}

module.exports = {
  HeartFailureStageAssessmentExt,
  GDMTOptimizationExt,
  LVADCandidateSelectionExt,
  HeartTransplantListingExt,
  CardioMemsHDExt,
  InotropeWeaningProtocolExt,
  PalliativeHFConsultExt,
  HFReadmissionRiskExt,
  AmyloidCardiomyopathyScreenExt,
  CRTResponsePredictionExt,
};