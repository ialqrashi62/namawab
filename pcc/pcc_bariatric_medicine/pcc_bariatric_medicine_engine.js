// P3-DY pcc_bariatric_medicine_engine v3.89.0
'use strict';
function BMIClassification(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bMIClassification-none';
  if (t === 'yes') plan = 'bMIClassification-protocol';
  return { plan, t };
}
function BariatricSurgeryEligibility(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bariatricSurgeryEligibility-none';
  if (t === 'yes') plan = 'bariatricSurgeryEligibility-protocol';
  return { plan, t };
}
function RouxEnYIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rouxEnYIndication-none';
  if (t === 'yes') plan = 'rouxEnYIndication-protocol';
  return { plan, t };
}
function SleeveGastrectomySelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sleeveGastrectomySelection-none';
  if (t === 'yes') plan = 'sleeveGastrectomySelection-protocol';
  return { plan, t };
}
function GastricBypassRevision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gastricBypassRevision-none';
  if (t === 'yes') plan = 'gastricBypassRevision-protocol';
  return { plan, t };
}
function PostBariatricNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postBariatricNutrition-none';
  if (t === 'yes') plan = 'postBariatricNutrition-protocol';
  return { plan, t };
}
function BariatricPsychEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bariatricPsychEval-none';
  if (t === 'yes') plan = 'bariatricPsychEval-protocol';
  return { plan, t };
}
function WeightRegainManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'weightRegainManagement-none';
  if (t === 'yes') plan = 'weightRegainManagement-protocol';
  return { plan, t };
}
function BariatricComplications(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bariatricComplications-none';
  if (t === 'yes') plan = 'bariatricComplications-protocol';
  return { plan, t };
}
function MetabolicSurgeryOutcomes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'metabolicSurgeryOutcomes-none';
  if (t === 'yes') plan = 'metabolicSurgeryOutcomes-protocol';
  return { plan, t };
}
module.exports = { BMIClassification, BariatricSurgeryEligibility, RouxEnYIndication, SleeveGastrectomySelection, GastricBypassRevision, PostBariatricNutrition, BariatricPsychEval, WeightRegainManagement, BariatricComplications, MetabolicSurgeryOutcomes };
