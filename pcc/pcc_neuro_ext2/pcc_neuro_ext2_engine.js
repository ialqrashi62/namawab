// P3_CK pcc_neuro_ext2_engine v3.49.0
'use strict';
function StrokeScale(input) {
  const i = input || {};
  const s = Number(i.s ?? 0);
  let plan = 'no-stroke';
  if (s >= 20) plan = 'severe-stroke';
  else if (s >= 6) plan = 'moderate-stroke';
  else if (s >= 1) plan = 'minor-stroke';
  return { plan, s };
}
function Seizure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-seizure';
  if (t === 'generalized') plan = 'generalized-seizure';
  else if (t === 'focal') plan = 'focal-seizure';
  else if (t === 'status') plan = 'status-epilepticus';
  return { plan, t };
}
function Headache(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tension-headache';
  if (t === 'migraine') plan = 'migraine-protocol';
  else if (t === 'cluster') plan = 'cluster-headache';
  else if (t === 'thunderclap') plan = 'subarachnoid-rule-out';
  return { plan, t };
}
function GCS(input) {
  const i = input || {};
  const s = Number(i.s ?? 15);
  let plan = 'normal-GCS';
  if (s <= 8) plan = 'severe-TBI';
  else if (s <= 12) plan = 'moderate-TBI';
  else if (s <= 14) plan = 'mild-TBI';
  return { plan, s };
}
function Neuropathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'general-neuropathy';
  if (t === 'diabetic') plan = 'diabetic-neuropathy';
  else if (t === 'chemo') plan = 'chemo-induced-neuropathy';
  return { plan, t };
}
function Movement(input) {
  const i = input || {};
  const d = String(i.d || '');
  let plan = 'no-movement';
  if (d === 'parkinsonism') plan = 'parkinsonism-care';
  else if (d === 'tremor') plan = 'tremor-evaluation';
  return { plan, d };
}
function Dementia(input) {
  const i = input || {};
  const mmse = Number(i.m ?? 30);
  let plan = 'normal-cognition';
  if (mmse < 10) plan = 'severe-dementia';
  else if (mmse < 20) plan = 'moderate-dementia';
  else if (mmse < 25) plan = 'mild-dementia';
  return { plan, mmse };
}
function Ms(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-MS';
  if (t === 'relapse') plan = 'MS-relapse';
  else if (t === 'stable') plan = 'MS-stable';
  return { plan, t };
}
function Gbs(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'no-GBS';
  if (s === 'severe') plan = 'severe-GBS-IVIG';
  return { plan, s };
}
function Myasthenia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'stable-MG';
  if (t === 'crisis') plan = 'myasthenic-crisis';
  return { plan, t };
}
module.exports = {
  StrokeScale, Seizure, Headache, GCS, Neuropathy, Movement, Dementia, Ms, Gbs, Myasthenia
};
