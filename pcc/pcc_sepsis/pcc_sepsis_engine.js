// P3-CS pcc_sepsis_engine v3.57.0
'use strict';
function Screening(input) {
  const i = input || {};
  const q = Number(i.q ?? 0);
  let plan = 'low-qsofa';
  if (q >= 3) plan = 'high-qsofa-screen';
  else if (q >= 2) plan = 'qsofa-positive';
  return { plan, q };
}
function Lactate(input) {
  const i = input || {};
  const v = Number(i.v ?? 1);
  let plan = 'normal-lactate';
  if (v >= 4) plan = 'elevated-lactate';
  else if (v >= 2) plan = 'mild-lactate';
  return { plan, v };
}
function Abx(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'no-ABx';
  if (m === '1hr') plan = 'antibiotic-1hr';
  return { plan, m };
}
function Fluid(input) {
  const i = input || {};
  const ml = Number(i.ml ?? 0);
  let plan = 'no-fluid';
  if (ml >= 30) plan = '30ml-kg-fluid';
  return { plan, ml };
}
function Vasopressor(input) {
  const i = input || {};
  const m = Number(i.map ?? 70);
  let plan = 'no-vaso';
  if (m < 65) plan = 'MAP-below-target';
  if (m >= 65) plan = 'map-target-65';
  return { plan, m };
}
function Culture(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-culture';
  if (t === 'blood') plan = 'blood-culture';
  return { plan, t };
}
function SourceCtl(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-source';
  if (t === 'abscess') plan = 'abscess-drainage';
  return { plan, t };
}
function DeEscalate(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'no-deescalation';
  if (c === 'narrow') plan = 'narrow-spectrum';
  return { plan, c };
}
function Procalcitonin(input) {
  const i = input || {};
  const v = Number(i.v ?? 0);
  let plan = 'normal-procal';
  if (v >= 2) plan = 'elevated-procal';
  else if (v >= 0.5) plan = 'mild-elevated-procal';
  return { plan, v };
}
function SepsisShock(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-shock';
  if (t === 'confirmed') plan = 'septic-shock-bundle';
  return { plan, t };
}
module.exports = {
  Screening, Lactate, Abx, Fluid, Vasopressor, Culture, SourceCtl, DeEscalate, Procalcitonin, SepsisShock
};
