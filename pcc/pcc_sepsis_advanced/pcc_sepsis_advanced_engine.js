// P3-DM pcc_sepsis_advanced_engine v3.77.0
'use strict';
function SepsisRecognition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sepsisrecognition-none';
  if (t === 'yes') plan = 'sepsisrecognition-protocol';
  return { plan, t };
}
function LactateGuidedResuscitation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lactateguidedresuscitation-none';
  if (t === 'yes') plan = 'lactateguidedresuscitation-protocol';
  return { plan, t };
}
function FluidResponsiveness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fluidresponsiveness-none';
  if (t === 'yes') plan = 'fluidresponsiveness-protocol';
  return { plan, t };
}
function VasopressorSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vasopressorselection-none';
  if (t === 'yes') plan = 'vasopressorselection-protocol';
  return { plan, t };
}
function CorticosteroidSepsis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'corticosteroidsepsis-none';
  if (t === 'yes') plan = 'corticosteroidsepsis-protocol';
  return { plan, t };
}
function SourceControlPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sourcecontrolplan-none';
  if (t === 'yes') plan = 'sourcecontrolplan-protocol';
  return { plan, t };
}
function EndOrganPerfusion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endorganperfusion-none';
  if (t === 'yes') plan = 'endorganperfusion-protocol';
  return { plan, t };
}
function SepsisBundleCompliance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sepsisbundlecompliance-none';
  if (t === 'yes') plan = 'sepsisbundlecompliance-protocol';
  return { plan, t };
}
function PostSepsisFollowUp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postsepsisfollowup-none';
  if (t === 'yes') plan = 'postsepsisfollowup-protocol';
  return { plan, t };
}
function SepsisReadmissionRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sepsisreadmissionrisk-none';
  if (t === 'yes') plan = 'sepsisreadmissionrisk-protocol';
  return { plan, t };
}
module.exports = {
  SepsisRecognition, LactateGuidedResuscitation, FluidResponsiveness, VasopressorSelection, CorticosteroidSepsis, SourceControlPlan, EndOrganPerfusion, SepsisBundleCompliance, PostSepsisFollowUp, SepsisReadmissionRisk
};
