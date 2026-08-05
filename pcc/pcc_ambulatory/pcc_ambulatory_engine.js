// P3_CT pcc_ambulatory_engine v3.58.0
'use strict';
function VisitType(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'general-visit';
  if (t === 'annual') plan = 'annual-wellness';
  else if (t === 'followup') plan = 'followup-visit';
  return { plan, t };
}
function Refill(input) {
  const i = input || {};
  const n = Number(i.n ?? 0);
  let plan = 'no-refill';
  if (n >= 3) plan = 'multi-refill';
  else if (n >= 1) plan = 'single-refill';
  return { plan, n };
}
function Wellness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-wellness';
  if (t === 'complete') plan = 'wellness-complete';
  return { plan, t };
}
function ChronicCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-chronic';
  if (t === 'controlled') plan = 'chronic-controlled';
  else if (t === 'uncontrolled') plan = 'chronic-uncontrolled';
  return { plan, t };
}
function Preventive(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-preventive';
  if (t === 'cancer-screen') plan = 'cancer-screening';
  return { plan, t };
}
function Immunization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-imm';
  if (t === 'flu') plan = 'flu-vaccine';
  return { plan, t };
}
function HgbA1c(input) {
  const i = input || {};
  const v = Number(i.v ?? 7);
  let plan = 'A1c-controlled';
  if (v >= 9) plan = 'A1c-uncontrolled';
  return { plan, v };
}
function BpCheck(input) {
  const i = input || {};
  const s = Number(i.s ?? 120);
  let plan = 'normal-BP';
  if (s >= 140) plan = 'stage-2-BP';
  else if (s >= 130) plan = 'stage-1-BP';
  return { plan, s };
}
function Smoking(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-smoking';
  if (t === 'current') plan = 'smoking-cessation';
  return { plan, t };
}
function DrVisit(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-visit';
  if (t === 'follow-up') plan = 'follow-up-visit';
  return { plan, t };
}
module.exports = {
  VisitType, Refill, Wellness, ChronicCare, Preventive, Immunization, HgbA1c, BpCheck, Smoking, DrVisit
};
