// P3_CQ pcc_case_mgmt_engine v3.55.0
'use strict';
function Intake(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-intake';
  if (t === 'urgent') plan = 'urgent-case';
  return { plan, t };
}
function Coord(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-coord';
  if (t === 'complex') plan = 'complex-coord';
  return { plan, t };
}
function Dc(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-discharge';
  if (t === 'planned') plan = 'planned-discharge';
  return { plan, t };
}
function Transition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-transition';
  if (t === 'care-level') plan = 'care-level-transition';
  return { plan, t };
}
function Followup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-followup';
  if (t === 'scheduled') plan = 'scheduled-followup';
  return { plan, t };
}
function Barriers(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-barriers';
  if (t === 'multiple') plan = 'multiple-barriers';
  return { plan, t };
}
function Insurance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-insurance';
  if (t === 'pending') plan = 'insurance-pending';
  return { plan, t };
}
function Uta(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-UTA';
  if (t === 'yes') plan = 'UTA-risk';
  return { plan, t };
}
function Readmission(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-readmission';
  if (t === 'high') plan = 'high-readmission-risk';
  return { plan, t };
}
function Multidisc(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-multidisc';
  if (t === 'rounds') plan = 'multidisc-rounds';
  return { plan, t };
}
module.exports = {
  Intake, Coord, Dc, Transition, Followup, Barriers, Insurance, Uta, Readmission, Multidisc
};
