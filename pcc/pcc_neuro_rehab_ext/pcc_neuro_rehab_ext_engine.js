// P3-DW pcc_neuro_rehab_ext_engine v3.87.0
'use strict';
function StrokeNeuroplasticityProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'strokeNeuroplasticityProtocol-none';
  if (t === 'yes') plan = 'strokeNeuroplasticityProtocol-protocol';
  return { plan, t };
}
function ConstraintInducedMovement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'constraintInducedMovement-none';
  if (t === 'yes') plan = 'constraintInducedMovement-protocol';
  return { plan, t };
}
function VestibularRehabStroke(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vestibularRehabStroke-none';
  if (t === 'yes') plan = 'vestibularRehabStroke-protocol';
  return { plan, t };
}
function SpasticityManagementITB(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spasticityManagementITB-none';
  if (t === 'yes') plan = 'spasticityManagementITB-protocol';
  return { plan, t };
}
function DysphagiaSwallowTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dysphagiaSwallowTherapy-none';
  if (t === 'yes') plan = 'dysphagiaSwallowTherapy-protocol';
  return { plan, t };
}
function CognitiveRehabTraumatic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cognitiveRehabTraumatic-none';
  if (t === 'yes') plan = 'cognitiveRehabTraumatic-protocol';
  return { plan, t };
}
function AphasiaLanguageTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aphasiaLanguageTherapy-none';
  if (t === 'yes') plan = 'aphasiaLanguageTherapy-protocol';
  return { plan, t };
}
function SpinalCordInjuryRehab(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalCordInjuryRehab-none';
  if (t === 'yes') plan = 'spinalCordInjuryRehab-protocol';
  return { plan, t };
}
function WheelchairMobilityPrescription(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'wheelchairMobilityPrescription-none';
  if (t === 'yes') plan = 'wheelchairMobilityPrescription-protocol';
  return { plan, t };
}
function NeuroRehabGoalSetting(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuroRehabGoalSetting-none';
  if (t === 'yes') plan = 'neuroRehabGoalSetting-protocol';
  return { plan, t };
}
module.exports = { StrokeNeuroplasticityProtocol, ConstraintInducedMovement, VestibularRehabStroke, SpasticityManagementITB, DysphagiaSwallowTherapy, CognitiveRehabTraumatic, AphasiaLanguageTherapy, SpinalCordInjuryRehab, WheelchairMobilityPrescription, NeuroRehabGoalSetting };
