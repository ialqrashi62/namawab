// P3-EH pcc_pediatric_rheum_engine v3.98.0
'use strict';
function JuvenileIdiopathicArthritis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'juvenileIdiopathicArthritis-none';
  if (t === 'yes') plan = 'juvenileIdiopathicArthritis-protocol';
  return { plan, t };
}
function KawasakiDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'kawasakiDisease-none';
  if (t === 'yes') plan = 'kawasakiDisease-protocol';
  return { plan, t };
}
function HenochSchonleinPurpura(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'henochSchonleinPurpura-none';
  if (t === 'yes') plan = 'henochSchonleinPurpura-protocol';
  return { plan, t };
}
function PediatricSLE(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSLE-none';
  if (t === 'yes') plan = 'pediatricSLE-protocol';
  return { plan, t };
}
function JuvenileDermatomyositis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'juvenileDermatomyositis-none';
  if (t === 'yes') plan = 'juvenileDermatomyositis-protocol';
  return { plan, t };
}
function PediatricVasculitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricVasculitis-none';
  if (t === 'yes') plan = 'pediatricVasculitis-protocol';
  return { plan, t };
}
function PeriodicFeverSyndromes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'periodicFeverSyndromes-none';
  if (t === 'yes') plan = 'periodicFeverSyndromes-protocol';
  return { plan, t };
}
function PediatricScleroderma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricScleroderma-none';
  if (t === 'yes') plan = 'pediatricScleroderma-protocol';
  return { plan, t };
}
function PediatricBehcet(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBehcet-none';
  if (t === 'yes') plan = 'pediatricBehcet-protocol';
  return { plan, t };
}
function GrowingPainsEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'growingPainsEvaluation-none';
  if (t === 'yes') plan = 'growingPainsEvaluation-protocol';
  return { plan, t };
}
module.exports = { JuvenileIdiopathicArthritis, KawasakiDisease, HenochSchonleinPurpura, PediatricSLE, JuvenileDermatomyositis, PediatricVasculitis, PeriodicFeverSyndromes, PediatricScleroderma, PediatricBehcet, GrowingPainsEvaluation };
