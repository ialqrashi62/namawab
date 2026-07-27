// P3-EF pcc_neuropsychology_engine v3.96.0
'use strict';
function NeuropsychologicalAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuropsychologicalAssessment-none';
  if (t === 'yes') plan = 'neuropsychologicalAssessment-protocol';
  return { plan, t };
}
function CognitiveRehabilitationPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cognitiveRehabilitationPlan-none';
  if (t === 'yes') plan = 'cognitiveRehabilitationPlan-protocol';
  return { plan, t };
}
function DementiaDifferential(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dementiaDifferential-none';
  if (t === 'yes') plan = 'dementiaDifferential-protocol';
  return { plan, t };
}
function TraumaticBrainInjuryEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'traumaticBrainInjuryEval-none';
  if (t === 'yes') plan = 'traumaticBrainInjuryEval-protocol';
  return { plan, t };
}
function ADHDAdultAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aDHDAdultAssessment-none';
  if (t === 'yes') plan = 'aDHDAdultAssessment-protocol';
  return { plan, t };
}
function AutismSpectrumEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autismSpectrumEval-none';
  if (t === 'yes') plan = 'autismSpectrumEval-protocol';
  return { plan, t };
}
function LearningDisorderEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'learningDisorderEval-none';
  if (t === 'yes') plan = 'learningDisorderEval-protocol';
  return { plan, t };
}
function ExecutiveFunctionAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'executiveFunctionAssessment-none';
  if (t === 'yes') plan = 'executiveFunctionAssessment-protocol';
  return { plan, t };
}
function MemoryDisorderEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'memoryDisorderEval-none';
  if (t === 'yes') plan = 'memoryDisorderEval-protocol';
  return { plan, t };
}
function NeuropsychiatricSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuropsychiatricSyndrome-none';
  if (t === 'yes') plan = 'neuropsychiatricSyndrome-protocol';
  return { plan, t };
}
module.exports = { NeuropsychologicalAssessment, CognitiveRehabilitationPlan, DementiaDifferential, TraumaticBrainInjuryEval, ADHDAdultAssessment, AutismSpectrumEval, LearningDisorderEval, ExecutiveFunctionAssessment, MemoryDisorderEval, NeuropsychiatricSyndrome };
