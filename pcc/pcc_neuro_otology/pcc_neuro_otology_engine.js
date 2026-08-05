// P3_ED pcc_neuro_otology_engine v3.94.0
'use strict';
function VestibularMigraineAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vestibularMigraineAssessment-none';
  if (t === 'yes') plan = 'vestibularMigraineAssessment-protocol';
  return { plan, t };
}
function MeniereDiseaseManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'meniereDiseaseManagement-none';
  if (t === 'yes') plan = 'meniereDiseaseManagement-protocol';
  return { plan, t };
}
function BPPVCanalithRepositioning(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bPPVCanalithRepositioning-none';
  if (t === 'yes') plan = 'bPPVCanalithRepositioning-protocol';
  return { plan, t };
}
function AcousticNeuromaScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acousticNeuromaScreening-none';
  if (t === 'yes') plan = 'acousticNeuromaScreening-protocol';
  return { plan, t };
}
function SuddenHearingLossProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'suddenHearingLossProtocol-none';
  if (t === 'yes') plan = 'suddenHearingLossProtocol-protocol';
  return { plan, t };
}
function TinnitusAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tinnitusAssessment-none';
  if (t === 'yes') plan = 'tinnitusAssessment-protocol';
  return { plan, t };
}
function OtotoxicityMonitoring(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ototoxicityMonitoring-none';
  if (t === 'yes') plan = 'ototoxicityMonitoring-protocol';
  return { plan, t };
}
function CochlearImplantCandidacy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cochlearImplantCandidacy-none';
  if (t === 'yes') plan = 'cochlearImplantCandidacy-protocol';
  return { plan, t };
}
function SuperiorCanalDehiscence(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'superiorCanalDehiscence-none';
  if (t === 'yes') plan = 'superiorCanalDehiscence-protocol';
  return { plan, t };
}
function AutoimmuneInnerEarDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autoimmuneInnerEarDisease-none';
  if (t === 'yes') plan = 'autoimmuneInnerEarDisease-protocol';
  return { plan, t };
}
module.exports = { VestibularMigraineAssessment, MeniereDiseaseManagement, BPPVCanalithRepositioning, AcousticNeuromaScreening, SuddenHearingLossProtocol, TinnitusAssessment, OtotoxicityMonitoring, CochlearImplantCandidacy, SuperiorCanalDehiscence, AutoimmuneInnerEarDisease };
