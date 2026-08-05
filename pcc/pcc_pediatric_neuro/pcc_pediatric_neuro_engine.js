// P3_EE pcc_pediatric_neuro_engine v3.95.0
'use strict';
function PediatricEpilepsySyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEpilepsySyndrome-none';
  if (t === 'yes') plan = 'pediatricEpilepsySyndrome-protocol';
  return { plan, t };
}
function CerebralPalsyClassification(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cerebralPalsyClassification-none';
  if (t === 'yes') plan = 'cerebralPalsyClassification-protocol';
  return { plan, t };
}
function PediatricStrokeWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricStrokeWorkup-none';
  if (t === 'yes') plan = 'pediatricStrokeWorkup-protocol';
  return { plan, t };
}
function NeurocutaneousSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neurocutaneousSyndrome-none';
  if (t === 'yes') plan = 'neurocutaneousSyndrome-protocol';
  return { plan, t };
}
function PediatricMigraineManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMigraineManagement-none';
  if (t === 'yes') plan = 'pediatricMigraineManagement-protocol';
  return { plan, t };
}
function FebrileSeizureRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'febrileSeizureRisk-none';
  if (t === 'yes') plan = 'febrileSeizureRisk-protocol';
  return { plan, t };
}
function NeurodegenerativePediatric(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neurodegenerativePediatric-none';
  if (t === 'yes') plan = 'neurodegenerativePediatric-protocol';
  return { plan, t };
}
function PediatricMovementDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMovementDisorder-none';
  if (t === 'yes') plan = 'pediatricMovementDisorder-protocol';
  return { plan, t };
}
function PediatricNeurometabolic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNeurometabolic-none';
  if (t === 'yes') plan = 'pediatricNeurometabolic-protocol';
  return { plan, t };
}
function CNSDevelopmentalDelay(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cNSDevelopmentalDelay-none';
  if (t === 'yes') plan = 'cNSDevelopmentalDelay-protocol';
  return { plan, t };
}
module.exports = { PediatricEpilepsySyndrome, CerebralPalsyClassification, PediatricStrokeWorkup, NeurocutaneousSyndrome, PediatricMigraineManagement, FebrileSeizureRisk, NeurodegenerativePediatric, PediatricMovementDisorder, PediatricNeurometabolic, CNSDevelopmentalDelay };
