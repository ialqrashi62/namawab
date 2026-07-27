// P3-DU pcc_pain_procedure_suite_engine v3.85.0
'use strict';
function ProceduralSedation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'proceduralSedation-none';
  if (t === 'yes') plan = 'proceduralSedation-protocol';
  return { plan, t };
}
function EpiduralBlock(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'epiduralBlock-none';
  if (t === 'yes') plan = 'epiduralBlock-protocol';
  return { plan, t };
}
function FacetJointInjection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'facetJointInjection-none';
  if (t === 'yes') plan = 'facetJointInjection-protocol';
  return { plan, t };
}
function RadiofrequencyAblation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'radiofrequencyAblation-none';
  if (t === 'yes') plan = 'radiofrequencyAblation-protocol';
  return { plan, t };
}
function SpinalCordStimulator(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalCordStimulator-none';
  if (t === 'yes') plan = 'spinalCordStimulator-protocol';
  return { plan, t };
}
function IntrathecalPump(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'intrathecalPump-none';
  if (t === 'yes') plan = 'intrathecalPump-protocol';
  return { plan, t };
}
function NerveBlockPeripheral(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nerveBlockPeripheral-none';
  if (t === 'yes') plan = 'nerveBlockPeripheral-protocol';
  return { plan, t };
}
function TriggerPointInjection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'triggerPointInjection-none';
  if (t === 'yes') plan = 'triggerPointInjection-protocol';
  return { plan, t };
}
function JointAspiration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'jointAspiration-none';
  if (t === 'yes') plan = 'jointAspiration-protocol';
  return { plan, t };
}
function PainProcedureConsciousSedation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'painProcedureConsciousSedation-none';
  if (t === 'yes') plan = 'painProcedureConsciousSedation-protocol';
  return { plan, t };
}
module.exports = { ProceduralSedation, EpiduralBlock, FacetJointInjection, RadiofrequencyAblation, SpinalCordStimulator, IntrathecalPump, NerveBlockPeripheral, TriggerPointInjection, JointAspiration, PainProcedureConsciousSedation };
