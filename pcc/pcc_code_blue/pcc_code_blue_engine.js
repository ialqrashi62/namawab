// P3-CS pcc_code_blue_engine v3.57.0
'use strict';
function Confirm(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-code';
  if (t === 'pulseless') plan = 'pulseless-VF-VT';
  else if (t === 'pea') plan = 'PEA-asystole';
  return { plan, t };
}
function Cpr(input) {
  const i = input || {};
  const q = String(i.q || '');
  let plan = 'CPR-in-progress';
  if (q === 'good') plan = 'high-quality-CPR';
  return { plan, q };
}
function Defib(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-shock';
  if (t === 'shockable') plan = 'shockable-rhythm';
  return { plan, t };
}
function Epi(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'no-epi';
  if (m === '1mg') plan = 'epinephrine-1mg';
  return { plan, m };
}
function Amio(input) {
  const i = input || {};
  const d = String(i.d || '');
  let plan = 'no-amio';
  if (d === '300') plan = 'amiodarone-300mg';
  return { plan, d };
}
function Airway(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-airway';
  if (t === 'intubated') plan = 'intubated-Airway';
  return { plan, t };
}
function Rhythm(input) {
  const i = input || {};
  const r = String(i.r || '');
  let plan = 'unknown-rhythm';
  if (r === 'asystole') plan = 'asystole-continued-CPR';
  return { plan, r };
}
function Rosc(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ROSC';
  if (t === 'achieved') plan = 'ROSC-achieved';
  return { plan, t };
}
function Etiology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-etiology';
  if (t === 'HsTs') plan = 'HsTs-workup';
  return { plan, t };
}
function Termination(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-termination';
  if (t === 'asystole') plan = 'asystole-termination';
  return { plan, t };
}
module.exports = {
  Confirm, Cpr, Defib, Epi, Amio, Airway, Rhythm, Rosc, Etiology, Termination
};
