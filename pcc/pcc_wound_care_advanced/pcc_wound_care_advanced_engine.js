// P3-EA pcc_wound_care_advanced_engine v3.91.0
'use strict';
function DiabeticFootUlcerStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diabeticFootUlcerStaging-none';
  if (t === 'yes') plan = 'diabeticFootUlcerStaging-protocol';
  return { plan, t };
}
function PressureInjuryStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pressureInjuryStaging-none';
  if (t === 'yes') plan = 'pressureInjuryStaging-protocol';
  return { plan, t };
}
function VenousLegUlcerCompression(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'venousLegUlcerCompression-none';
  if (t === 'yes') plan = 'venousLegUlcerCompression-protocol';
  return { plan, t };
}
function ArterialWoundAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'arterialWoundAssessment-none';
  if (t === 'yes') plan = 'arterialWoundAssessment-protocol';
  return { plan, t };
}
function WoundBiofilmManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'woundBiofilmManagement-none';
  if (t === 'yes') plan = 'woundBiofilmManagement-protocol';
  return { plan, t };
}
function NegativePressureWoundTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'negativePressureWoundTherapy-none';
  if (t === 'yes') plan = 'negativePressureWoundTherapy-protocol';
  return { plan, t };
}
function HyperbaricOxygenIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hyperbaricOxygenIndication-none';
  if (t === 'yes') plan = 'hyperbaricOxygenIndication-protocol';
  return { plan, t };
}
function SkinGraftSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'skinGraftSelection-none';
  if (t === 'yes') plan = 'skinGraftSelection-protocol';
  return { plan, t };
}
function FlapCoverageDecision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'flapCoverageDecision-none';
  if (t === 'yes') plan = 'flapCoverageDecision-protocol';
  return { plan, t };
}
function WoundCareNutritionProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'woundCareNutritionProtocol-none';
  if (t === 'yes') plan = 'woundCareNutritionProtocol-protocol';
  return { plan, t };
}
module.exports = { DiabeticFootUlcerStaging, PressureInjuryStaging, VenousLegUlcerCompression, ArterialWoundAssessment, WoundBiofilmManagement, NegativePressureWoundTherapy, HyperbaricOxygenIndication, SkinGraftSelection, FlapCoverageDecision, WoundCareNutritionProtocol };
