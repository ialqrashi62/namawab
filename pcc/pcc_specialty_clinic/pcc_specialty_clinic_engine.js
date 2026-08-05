// P3_CT pcc_specialty_clinic_engine v3.58.0
'use strict';
function Referral(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'no-referral';
  if (s === 'cardio') plan = 'cardio-referral';
  else if (s === 'onc') plan = 'onc-referral';
  return { plan, s };
}
function Consult(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-consult';
  if (t === 'initial') plan = 'initial-consult';
  else if (t === 'followup') plan = 'followup-consult';
  return { plan, t };
}
function SecondOpinion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-2nd-opinion';
  if (t === 'requested') plan = 'second-opinion';
  return { plan, t };
}
function FollowUp(input) {
  const i = input || {};
  const d = Number(i.d ?? 30);
  let plan = 'standard-fu';
  if (d >= 90) plan = '90-day-followup';
  return { plan, d };
}
function Procedure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-procedure';
  if (t === 'scope') plan = 'specialty-procedure';
  return { plan, t };
}
function Triage(input) {
  const i = input || {};
  const l = Number(i.l ?? 5);
  let plan = 'routine-specialty';
  if (l === 1) plan = 'urgent-specialty';
  return { plan, l };
}
function NextStep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-next';
  if (t === 'imaging') plan = 'imaging-ordered';
  return { plan, t };
}
function Interval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-interval';
  if (t === 'active') plan = 'active-treatment-interval';
  return { plan, t };
}
function Coord(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-coord';
  if (t === 'multi') plan = 'multi-specialty-coord';
  return { plan, t };
}
function Transition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-transition';
  if (t === 'PCP') plan = 'PCP-transition';
  return { plan, t };
}
module.exports = {
  Referral, Consult, SecondOpinion, FollowUp, Procedure, Triage, NextStep, Interval, Coord, Transition
};
