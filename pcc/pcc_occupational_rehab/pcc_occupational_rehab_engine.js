// P3-DD pcc_occupational_rehab_engine v3.68.0
'use strict';
function WorkCapacity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'workcapacity-none';
  if (t === 'yes') plan = 'workcapacity-protocol';
  return { plan, t };
}
function ErgonomicAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ergonomicassessment-none';
  if (t === 'yes') plan = 'ergonomicassessment-protocol';
  return { plan, t };
}
function FunctionalRestoration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'functionalrestoration-none';
  if (t === 'yes') plan = 'functionalrestoration-protocol';
  return { plan, t };
}
function ReturnToWork(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'returntowork-none';
  if (t === 'yes') plan = 'returntowork-protocol';
  return { plan, t };
}
function VocationalRetraining(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vocationalretraining-none';
  if (t === 'yes') plan = 'vocationalretraining-protocol';
  return { plan, t };
}
function WorkHardening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'workhardening-none';
  if (t === 'yes') plan = 'workhardening-protocol';
  return { plan, t };
}
function PainAtWork(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'painatwork-none';
  if (t === 'yes') plan = 'painatwork-protocol';
  return { plan, t };
}
function CognitiveDemands(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cognitivedemands-none';
  if (t === 'yes') plan = 'cognitivedemands-protocol';
  return { plan, t };
}
function SafetyClearance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'safetyclearance-none';
  if (t === 'yes') plan = 'safetyclearance-protocol';
  return { plan, t };
}
function DisabilityEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'disabilityevaluation-none';
  if (t === 'yes') plan = 'disabilityevaluation-protocol';
  return { plan, t };
}
module.exports = {
  WorkCapacity, ErgonomicAssessment, FunctionalRestoration, ReturnToWork, VocationalRetraining, WorkHardening, PainAtWork, CognitiveDemands, SafetyClearance, DisabilityEvaluation
};
