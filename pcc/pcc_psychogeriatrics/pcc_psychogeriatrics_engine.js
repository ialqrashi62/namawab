// P3-EC pcc_psychogeriatrics_engine v3.93.0
'use strict';
function DementiaAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dementiaAssessment-none';
  if (t === 'yes') plan = 'dementiaAssessment-protocol';
  return { plan, t };
}
function AlzheimerDiseaseStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'alzheimerDiseaseStaging-none';
  if (t === 'yes') plan = 'alzheimerDiseaseStaging-protocol';
  return { plan, t };
}
function LewyBodyDementia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lewyBodyDementia-none';
  if (t === 'yes') plan = 'lewyBodyDementia-protocol';
  return { plan, t };
}
function VascularDementia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularDementia-none';
  if (t === 'yes') plan = 'vascularDementia-protocol';
  return { plan, t };
}
function BehavioralPsychiatricSymptomsDementia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'behavioralPsychiatricSymptomsDementia-none';
  if (t === 'yes') plan = 'behavioralPsychiatricSymptomsDementia-protocol';
  return { plan, t };
}
function AntipsychoticInElderly(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'antipsychoticInElderly-none';
  if (t === 'yes') plan = 'antipsychoticInElderly-protocol';
  return { plan, t };
}
function DepressionInElderly(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'depressionInElderly-none';
  if (t === 'yes') plan = 'depressionInElderly-protocol';
  return { plan, t };
}
function FallsRiskDementia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fallsRiskDementia-none';
  if (t === 'yes') plan = 'fallsRiskDementia-protocol';
  return { plan, t };
}
function CaregiverBurnout(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'caregiverBurnout-none';
  if (t === 'yes') plan = 'caregiverBurnout-protocol';
  return { plan, t };
}
function CapacityAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'capacityAssessment-none';
  if (t === 'yes') plan = 'capacityAssessment-protocol';
  return { plan, t };
}
module.exports = { DementiaAssessment, AlzheimerDiseaseStaging, LewyBodyDementia, VascularDementia, BehavioralPsychiatricSymptomsDementia, AntipsychoticInElderly, DepressionInElderly, FallsRiskDementia, CaregiverBurnout, CapacityAssessment };
