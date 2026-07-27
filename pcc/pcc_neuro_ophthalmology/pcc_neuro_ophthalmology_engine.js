// P3-DZ pcc_neuro_ophthalmology_engine v3.90.0
'use strict';
function PapilledemaEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'papilledemaEvaluation-none';
  if (t === 'yes') plan = 'papilledemaEvaluation-protocol';
  return { plan, t };
}
function OpticNeuritisWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'opticNeuritisWorkup-none';
  if (t === 'yes') plan = 'opticNeuritisWorkup-protocol';
  return { plan, t };
}
function AnteriorIschemicOpticNeuropathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'anteriorIschemicOpticNeuropathy-none';
  if (t === 'yes') plan = 'anteriorIschemicOpticNeuropathy-protocol';
  return { plan, t };
}
function HomonymousHemianopiaLocalization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'homonymousHemianopiaLocalization-none';
  if (t === 'yes') plan = 'homonymousHemianopiaLocalization-protocol';
  return { plan, t };
}
function CranialNervePalsy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cranialNervePalsy-none';
  if (t === 'yes') plan = 'cranialNervePalsy-protocol';
  return { plan, t };
}
function PupilAssessmentNeuro(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pupilAssessmentNeuro-none';
  if (t === 'yes') plan = 'pupilAssessmentNeuro-protocol';
  return { plan, t };
}
function VisualFieldDefectInterpretation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'visualFieldDefectInterpretation-none';
  if (t === 'yes') plan = 'visualFieldDefectInterpretation-protocol';
  return { plan, t };
}
function OcularMotorAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ocularMotorAssessment-none';
  if (t === 'yes') plan = 'ocularMotorAssessment-protocol';
  return { plan, t };
}
function NystagmusLocalization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nystagmusLocalization-none';
  if (t === 'yes') plan = 'nystagmusLocalization-protocol';
  return { plan, t };
}
function TransientMonocularVisionLoss(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'transientMonocularVisionLoss-none';
  if (t === 'yes') plan = 'transientMonocularVisionLoss-protocol';
  return { plan, t };
}
module.exports = { PapilledemaEvaluation, OpticNeuritisWorkup, AnteriorIschemicOpticNeuropathy, HomonymousHemianopiaLocalization, CranialNervePalsy, PupilAssessmentNeuro, VisualFieldDefectInterpretation, OcularMotorAssessment, NystagmusLocalization, TransientMonocularVisionLoss };
