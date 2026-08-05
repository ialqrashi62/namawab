// P3_ED pcc_pediatric_urology_engine v3.94.0
'use strict';
function HypospadiasRepairTiming(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypospadiasRepairTiming-none';
  if (t === 'yes') plan = 'hypospadiasRepairTiming-protocol';
  return { plan, t };
}
function UndescendedTestisManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'undescendedTestisManagement-none';
  if (t === 'yes') plan = 'undescendedTestisManagement-protocol';
  return { plan, t };
}
function VesicoureteralRefluxGrading(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vesicoureteralRefluxGrading-none';
  if (t === 'yes') plan = 'vesicoureteralRefluxGrading-protocol';
  return { plan, t };
}
function PediatricUreteralReimplant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricUreteralReimplant-none';
  if (t === 'yes') plan = 'pediatricUreteralReimplant-protocol';
  return { plan, t };
}
function BladderExstrophyClosure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bladderExstrophyClosure-none';
  if (t === 'yes') plan = 'bladderExstrophyClosure-protocol';
  return { plan, t };
}
function PosteriorUrethralValves(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'posteriorUrethralValves-none';
  if (t === 'yes') plan = 'posteriorUrethralValves-protocol';
  return { plan, t };
}
function PediatricKidneyStones(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricKidneyStones-none';
  if (t === 'yes') plan = 'pediatricKidneyStones-protocol';
  return { plan, t };
}
function CircumcisionDecision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'circumcisionDecision-none';
  if (t === 'yes') plan = 'circumcisionDecision-protocol';
  return { plan, t };
}
function PediatricIncontinence(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricIncontinence-none';
  if (t === 'yes') plan = 'pediatricIncontinence-protocol';
  return { plan, t };
}
function DisordersOfSexDevelopment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'disordersOfSexDevelopment-none';
  if (t === 'yes') plan = 'disordersOfSexDevelopment-protocol';
  return { plan, t };
}
module.exports = { HypospadiasRepairTiming, UndescendedTestisManagement, VesicoureteralRefluxGrading, PediatricUreteralReimplant, BladderExstrophyClosure, PosteriorUrethralValves, PediatricKidneyStones, CircumcisionDecision, PediatricIncontinence, DisordersOfSexDevelopment };
