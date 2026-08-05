// Hand-written engine — PCC 3.185.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.185.0';
const MOD = 'pcc_valvular_intervention';

function TAVRCandidateExt(input) {
  const _i = input || {};
  const _r = { tavr_indicated: Number(_i.age || 75) > 70 && Number(_i.sts || 5) >= 4, age: Number(_i.age || 75), sts: Number(_i.sts || 5) };
  return Object.assign({ version: VER, module: MOD, function: 'TAVRCandidateExt', input, ts: TS }, _r);
}

function SAVRvsTAVRDecisionExt(input) {
  const _i = input || {};
  const age = Number(_i.age || 75);
  const risk = String(_i.risk || 'low');
  const _r = { recommendation: age > 75 || risk === 'high' || risk === 'prohibitive' ? 'TAVR' : 'SAVR' };
  return Object.assign({ version: VER, module: MOD, function: 'SAVRvsTAVRDecisionExt', input, ts: TS }, _r);
}

function MitraClipCandidateExt(input) {
  const _i = input || {};
  const _r = { eligible: Number(_i.mr || 3) >= 3 && Number(_i.ef || 30) >= 20 && Number(_i.ef || 30) <= 50 && String(_i.symptomatic || 'yes') === 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'MitraClipCandidateExt', input, ts: TS }, _r);
}

function ValveChoiceAnticoagExt(input) {
  const _i = input || {};
  const mech = String(_i.mech || 'no') === 'yes';
  const ao = String(_i.aortic || 'no') === 'yes';
  let therapy = 'none';
  if (mech) therapy = 'warfarin-INR-2.5-3.5';
  else if (ao && !mech) therapy = 'aspirin-81mg';
  const _r = { therapy };
  return Object.assign({ version: VER, module: MOD, function: 'ValveChoiceAnticoagExt', input, ts: TS }, _r);
}

function ProstheticValveDysfunctionExt(input) {
  const _i = input || {};
  const _r = { dysfunction: Number(_i.gradient || 20) > 30 || Number(_i.eoa || 1.5) < 1.0, gradient: Number(_i.gradient || 20), eoa: Number(_i.eoa || 1.5) };
  return Object.assign({ version: VER, module: MOD, function: 'ProstheticValveDysfunctionExt', input, ts: TS }, _r);
}

function BicuspidAorticValveSurveillanceExt(input) {
  const _i = input || {};
  const d = Number(_i.aorta_mm || 40);
  const _r = { echo_interval_months: d > 50 ? 6 : d > 45 ? 12 : 24 };
  return Object.assign({ version: VER, module: MOD, function: 'BicuspidAorticValveSurveillanceExt', input, ts: TS }, _r);
}

function EndocarditisProphylaxisExt(input) {
  const _i = input || {};
  const _r = { prophylaxis_indicated: String(_i.prosthetic || 'no') === 'yes' && String(_i.dental || 'no') === 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'EndocarditisProphylaxisExt', input, ts: TS }, _r);
}

function ValveInValveVIVExt(input) {
  const _i = input || {};
  const _r = { viv_recommended: Number(_i.age || 70) > 65 || String(_i.redo_risk || 'low') === 'high' };
  return Object.assign({ version: VER, module: MOD, function: 'ValveInValveVIVExt', input, ts: TS }, _r);
}

function AorticStenosisSeverityExt(input) {
  const _i = input || {};
  const ava = Number(_i.ava || 1.5);
  const vmax = Number(_i.vmax || 3.0);
  let severity = 'mild';
  if (ava < 1.0 || vmax >= 4.0) severity = 'severe';
  else if (ava < 1.5 || vmax >= 3.0) severity = 'moderate';
  const _r = { severity, ava, vmax };
  return Object.assign({ version: VER, module: MOD, function: 'AorticStenosisSeverityExt', input, ts: TS }, _r);
}

function MitralRegurgitationSeverityExt(input) {
  const _i = input || {};
  const v = Number(_i.vena || 5);
  let severity = 'mild';
  if (v >= 7) severity = 'severe';
  else if (v >= 4) severity = 'moderate';
  const _r = { severity, vena: v };
  return Object.assign({ version: VER, module: MOD, function: 'MitralRegurgitationSeverityExt', input, ts: TS }, _r);
}

module.exports = {
  TAVRCandidateExt,
  SAVRvsTAVRDecisionExt,
  MitraClipCandidateExt,
  ValveChoiceAnticoagExt,
  ProstheticValveDysfunctionExt,
  BicuspidAorticValveSurveillanceExt,
  EndocarditisProphylaxisExt,
  ValveInValveVIVExt,
  AorticStenosisSeverityExt,
  MitralRegurgitationSeverityExt,
};