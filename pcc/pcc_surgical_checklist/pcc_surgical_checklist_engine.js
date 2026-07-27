// P3-CR pcc_surgical_checklist_engine v3.56.0
'use strict';
function SignIn(input) {
  const i = input || {};
  const confirmed = String(i.c || '');
  let plan = 'sign-in-pending';
  if (confirmed === 'yes') plan = 'sign-in-completed';
  return { plan, confirmed };
}
function TimeOut(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'timeout-pending';
  if (c === 'completed') plan = 'timeout-completed';
  return { plan, c };
}
function SignOut(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'signout-pending';
  if (c === 'completed') plan = 'signout-completed';
  return { plan, c };
}
function SiteMark(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'no-site-mark';
  if (m === 'marked') plan = 'site-marked';
  return { plan, m };
}
function AllergyCheck(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'allergy-pending';
  if (c === 'verified') plan = 'allergy-verified';
  return { plan, c };
}
function AntibioConfirm(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'antibio-pending';
  if (c === 'given') plan = 'antibiotic-given';
  return { plan, c };
}
function ImplantConfirm(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'no-implant';
  if (c === 'verified') plan = 'implant-verified';
  return { plan, c };
}
function CountsFinal(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'counts-pending';
  if (c === 'correct') plan = 'counts-correct';
  return { plan, c };
}
function SpecimenConfirm(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'no-specimen';
  if (c === 'labeled') plan = 'specimen-labeled';
  return { plan, c };
}
function Recovery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'in-OR';
  if (t === 'transferred') plan = 'transferred-to-PACU';
  return { plan, t };
}
module.exports = {
  SignIn, TimeOut, SignOut, SiteMark, AllergyCheck, AntibioConfirm, ImplantConfirm, CountsFinal, SpecimenConfirm, Recovery
};
