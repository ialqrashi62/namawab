// P3-EP pcc_pediatric_surg_oncology_engine v3.106.0
'use strict';
function PediatricNeuroblastomaSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNeuroblastomaSurg-none';
  if (t === 'yes') plan = 'pediatricNeuroblastomaSurg-protocol';
  return { plan, t };
}
function PediatricWilmsTumorSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricWilmsTumorSurg-none';
  if (t === 'yes') plan = 'pediatricWilmsTumorSurg-protocol';
  return { plan, t };
}
function PediatricHepatoblastomaSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHepatoblastomaSurg-none';
  if (t === 'yes') plan = 'pediatricHepatoblastomaSurg-protocol';
  return { plan, t };
}
function PediatricRhabdomyosarcomaSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRhabdomyosarcomaSurg-none';
  if (t === 'yes') plan = 'pediatricRhabdomyosarcomaSurg-protocol';
  return { plan, t };
}
function PediatricOsteosarcomaSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOsteosarcomaSurg-none';
  if (t === 'yes') plan = 'pediatricOsteosarcomaSurg-protocol';
  return { plan, t };
}
function PediatricEwingsSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEwingsSurg-none';
  if (t === 'yes') plan = 'pediatricEwingsSurg-protocol';
  return { plan, t };
}
function PediatricRetinoblastomaSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRetinoblastomaSurg-none';
  if (t === 'yes') plan = 'pediatricRetinoblastomaSurg-protocol';
  return { plan, t };
}
function PediatricLymphomaSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLymphomaSurg-none';
  if (t === 'yes') plan = 'pediatricLymphomaSurg-protocol';
  return { plan, t };
}
function PediatricBrainTumorSurgExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBrainTumorSurgExt-none';
  if (t === 'yes') plan = 'pediatricBrainTumorSurgExt-protocol';
  return { plan, t };
}
function PediatricGermCellTumorSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGermCellTumorSurg-none';
  if (t === 'yes') plan = 'pediatricGermCellTumorSurg-protocol';
  return { plan, t };
}
module.exports = { PediatricNeuroblastomaSurg, PediatricWilmsTumorSurg, PediatricHepatoblastomaSurg, PediatricRhabdomyosarcomaSurg, PediatricOsteosarcomaSurg, PediatricEwingsSurg, PediatricRetinoblastomaSurg, PediatricLymphomaSurg, PediatricBrainTumorSurgExt, PediatricGermCellTumorSurg };
