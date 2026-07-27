// P3-DZ pcc_breast_imaging_engine v3.90.0
'use strict';
function BIRADSCategorization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bIRADSCategorization-none';
  if (t === 'yes') plan = 'bIRADSCategorization-protocol';
  return { plan, t };
}
function MammogramRecallProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mammogramRecallProtocol-none';
  if (t === 'yes') plan = 'mammogramRecallProtocol-protocol';
  return { plan, t };
}
function BreastUSIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'breastUSIndication-none';
  if (t === 'yes') plan = 'breastUSIndication-protocol';
  return { plan, t };
}
function BreastMRIHighRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'breastMRIHighRisk-none';
  if (t === 'yes') plan = 'breastMRIHighRisk-protocol';
  return { plan, t };
}
function TomosynthesisInterpretation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tomosynthesisInterpretation-none';
  if (t === 'yes') plan = 'tomosynthesisInterpretation-protocol';
  return { plan, t };
}
function DuctalCarcinomaInSitu(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ductalCarcinomaInSitu-none';
  if (t === 'yes') plan = 'ductalCarcinomaInSitu-protocol';
  return { plan, t };
}
function AtypiaManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'atypiaManagement-none';
  if (t === 'yes') plan = 'atypiaManagement-protocol';
  return { plan, t };
}
function BreastLesionBiopsyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'breastLesionBiopsyIndication-none';
  if (t === 'yes') plan = 'breastLesionBiopsyIndication-protocol';
  return { plan, t };
}
function ImplantRuptureImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'implantRuptureImaging-none';
  if (t === 'yes') plan = 'implantRuptureImaging-protocol';
  return { plan, t };
}
function MaleBreastImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'maleBreastImaging-none';
  if (t === 'yes') plan = 'maleBreastImaging-protocol';
  return { plan, t };
}
module.exports = { BIRADSCategorization, MammogramRecallProtocol, BreastUSIndication, BreastMRIHighRisk, TomosynthesisInterpretation, DuctalCarcinomaInSitu, AtypiaManagement, BreastLesionBiopsyIndication, ImplantRuptureImaging, MaleBreastImaging };
