// P3_ED pcc_dental_advanced_engine v3.94.0
'use strict';
function ImpactedThirdMolarAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'impactedThirdMolarAssessment-none';
  if (t === 'yes') plan = 'impactedThirdMolarAssessment-protocol';
  return { plan, t };
}
function DentalImplantCandidacy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dentalImplantCandidacy-none';
  if (t === 'yes') plan = 'dentalImplantCandidacy-protocol';
  return { plan, t };
}
function OrthognathicSurgeryPlanning(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'orthognathicSurgeryPlanning-none';
  if (t === 'yes') plan = 'orthognathicSurgeryPlanning-protocol';
  return { plan, t };
}
function TemporomandibularDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'temporomandibularDisorder-none';
  if (t === 'yes') plan = 'temporomandibularDisorder-protocol';
  return { plan, t };
}
function OralCancerScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oralCancerScreening-none';
  if (t === 'yes') plan = 'oralCancerScreening-protocol';
  return { plan, t };
}
function PeriodontalDiseaseStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'periodontalDiseaseStaging-none';
  if (t === 'yes') plan = 'periodontalDiseaseStaging-protocol';
  return { plan, t };
}
function EndodonticTreatmentPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endodonticTreatmentPlan-none';
  if (t === 'yes') plan = 'endodonticTreatmentPlan-protocol';
  return { plan, t };
}
function ProsthodonticRehabilitation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prosthodonticRehabilitation-none';
  if (t === 'yes') plan = 'prosthodonticRehabilitation-protocol';
  return { plan, t };
}
function PediatricDentalCaries(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDentalCaries-none';
  if (t === 'yes') plan = 'pediatricDentalCaries-protocol';
  return { plan, t };
}
function OralPathologyBiopsyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oralPathologyBiopsyIndication-none';
  if (t === 'yes') plan = 'oralPathologyBiopsyIndication-protocol';
  return { plan, t };
}
module.exports = { ImpactedThirdMolarAssessment, DentalImplantCandidacy, OrthognathicSurgeryPlanning, TemporomandibularDisorder, OralCancerScreening, PeriodontalDiseaseStaging, EndodonticTreatmentPlan, ProsthodonticRehabilitation, PediatricDentalCaries, OralPathologyBiopsyIndication };
