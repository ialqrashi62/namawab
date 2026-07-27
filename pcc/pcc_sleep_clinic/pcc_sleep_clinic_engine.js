// P3-DX pcc_sleep_clinic_engine v3.88.0
'use strict';
function PolysomnographyInterpretation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'polysomnographyInterpretation-none';
  if (t === 'yes') plan = 'polysomnographyInterpretation-protocol';
  return { plan, t };
}
function OSAHSeverityStratification(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oSAHSeverityStratification-none';
  if (t === 'yes') plan = 'oSAHSeverityStratification-protocol';
  return { plan, t };
}
function CPAPTitrationProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cPAPTitrationProtocol-none';
  if (t === 'yes') plan = 'cPAPTitrationProtocol-protocol';
  return { plan, t };
}
function BiPAPIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'biPAPIndication-none';
  if (t === 'yes') plan = 'biPAPIndication-protocol';
  return { plan, t };
}
function InsomniaCBTProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'insomniaCBTProtocol-none';
  if (t === 'yes') plan = 'insomniaCBTProtocol-protocol';
  return { plan, t };
}
function RestlessLegSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'restlessLegSyndrome-none';
  if (t === 'yes') plan = 'restlessLegSyndrome-protocol';
  return { plan, t };
}
function NarcolepsyDiagnosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'narcolepsyDiagnosis-none';
  if (t === 'yes') plan = 'narcolepsyDiagnosis-protocol';
  return { plan, t };
}
function CircadianRhythmDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'circadianRhythmDisorder-none';
  if (t === 'yes') plan = 'circadianRhythmDisorder-protocol';
  return { plan, t };
}
function ParasomniaEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'parasomniaEvaluation-none';
  if (t === 'yes') plan = 'parasomniaEvaluation-protocol';
  return { plan, t };
}
function SleepHygieneEducation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sleepHygieneEducation-none';
  if (t === 'yes') plan = 'sleepHygieneEducation-protocol';
  return { plan, t };
}
module.exports = { PolysomnographyInterpretation, OSAHSeverityStratification, CPAPTitrationProtocol, BiPAPIndication, InsomniaCBTProtocol, RestlessLegSyndrome, NarcolepsyDiagnosis, CircadianRhythmDisorder, ParasomniaEvaluation, SleepHygieneEducation };
