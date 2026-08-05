// P3_EG pcc_pediatric_endo_engine v3.97.0
'use strict';
function PediatricDiabetesType1(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDiabetesType1-none';
  if (t === 'yes') plan = 'pediatricDiabetesType1-protocol';
  return { plan, t };
}
function PediatricThyroidDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricThyroidDisease-none';
  if (t === 'yes') plan = 'pediatricThyroidDisease-protocol';
  return { plan, t };
}
function CongenitalAdrenalHyperplasia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalAdrenalHyperplasia-none';
  if (t === 'yes') plan = 'congenitalAdrenalHyperplasia-protocol';
  return { plan, t };
}
function PediatricGrowthDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGrowthDisorder-none';
  if (t === 'yes') plan = 'pediatricGrowthDisorder-protocol';
  return { plan, t };
}
function PediatricPubertyDisorders(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPubertyDisorders-none';
  if (t === 'yes') plan = 'pediatricPubertyDisorders-protocol';
  return { plan, t };
}
function PediatricObesityEndocrine(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricObesityEndocrine-none';
  if (t === 'yes') plan = 'pediatricObesityEndocrine-protocol';
  return { plan, t };
}
function PediatricBoneDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBoneDisease-none';
  if (t === 'yes') plan = 'pediatricBoneDisease-protocol';
  return { plan, t };
}
function PediatricPituitaryDisorders(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPituitaryDisorders-none';
  if (t === 'yes') plan = 'pediatricPituitaryDisorders-protocol';
  return { plan, t };
}
function PediatricLipidDisorders(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLipidDisorders-none';
  if (t === 'yes') plan = 'pediatricLipidDisorders-protocol';
  return { plan, t };
}
function NeonatalThyroidScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalThyroidScreening-none';
  if (t === 'yes') plan = 'neonatalThyroidScreening-protocol';
  return { plan, t };
}
module.exports = { PediatricDiabetesType1, PediatricThyroidDisease, CongenitalAdrenalHyperplasia, PediatricGrowthDisorder, PediatricPubertyDisorders, PediatricObesityEndocrine, PediatricBoneDisease, PediatricPituitaryDisorders, PediatricLipidDisorders, NeonatalThyroidScreening };
