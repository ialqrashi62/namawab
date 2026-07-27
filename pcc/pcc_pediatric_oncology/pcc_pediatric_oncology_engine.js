// P3-EI pcc_pediatric_oncology_engine v3.99.0
'use strict';
function PediatricLeukemiaALL(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLeukemiaALL-none';
  if (t === 'yes') plan = 'pediatricLeukemiaALL-protocol';
  return { plan, t };
}
function PediatricLeukemiaAML(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLeukemiaAML-none';
  if (t === 'yes') plan = 'pediatricLeukemiaAML-protocol';
  return { plan, t };
}
function PediatricBrainTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBrainTumor-none';
  if (t === 'yes') plan = 'pediatricBrainTumor-protocol';
  return { plan, t };
}
function NeuroblastomaManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuroblastomaManagement-none';
  if (t === 'yes') plan = 'neuroblastomaManagement-protocol';
  return { plan, t };
}
function WilmsTumorProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'wilmsTumorProtocol-none';
  if (t === 'yes') plan = 'wilmsTumorProtocol-protocol';
  return { plan, t };
}
function PediatricLymphoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLymphoma-none';
  if (t === 'yes') plan = 'pediatricLymphoma-protocol';
  return { plan, t };
}
function PediatricBoneTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBoneTumor-none';
  if (t === 'yes') plan = 'pediatricBoneTumor-protocol';
  return { plan, t };
}
function PediatricRetinoblastoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRetinoblastoma-none';
  if (t === 'yes') plan = 'pediatricRetinoblastoma-protocol';
  return { plan, t };
}
function PediatricHepaticTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHepaticTumor-none';
  if (t === 'yes') plan = 'pediatricHepaticTumor-protocol';
  return { plan, t };
}
function PediatricOncologicEmergency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOncologicEmergency-none';
  if (t === 'yes') plan = 'pediatricOncologicEmergency-protocol';
  return { plan, t };
}
module.exports = { PediatricLeukemiaALL, PediatricLeukemiaAML, PediatricBrainTumor, NeuroblastomaManagement, WilmsTumorProtocol, PediatricLymphoma, PediatricBoneTumor, PediatricRetinoblastoma, PediatricHepaticTumor, PediatricOncologicEmergency };
