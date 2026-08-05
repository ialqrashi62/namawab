// P3_CH pcc_perioperative_engine v3.46.0
'use strict';
function PreopEval(input) {
  const i = input || {};
  const a = String(i.asa || '');
  let plan = 'standard-preop';
  if (a === 'IV') plan = 'ASA-IV-complex-preop';
  else if (a === 'III') plan = 'ASA-III-preop';
  return { plan, a };
}
function Npo(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-NPO';
  if (t === 'clear') plan = 'clear-liquids-2hr';
  return { plan, t };
}
function Meds(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'standard-preop-meds';
  if (m === 'hold-anticoag') plan = 'hold-anticoag';
  else if (m === 'continue-beta') plan = 'continue-beta-blocker';
  return { plan, m };
}
function Handoff(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-handoff';
  if (t === 'timeout') plan = 'surgical-timeout';
  return { plan, t };
}
function SignIn(input) {
  const i = input || {};
  const confirmed = String(i.c || '');
  let plan = 'sign-in-pending';
  if (confirmed === 'yes') plan = 'sign-in-confirmed';
  return { plan, confirmed };
}
function TimeOut(input) {
  const i = input || {};
  const completed = String(i.c || '');
  let plan = 'timeout-pending';
  if (completed === 'yes') plan = 'timeout-completed';
  return { plan, completed };
}
function SignOut(input) {
  const i = input || {};
  const completed = String(i.c || '');
  let plan = 'signout-pending';
  if (completed === 'yes') plan = 'signout-completed';
  return { plan, completed };
}
function SkinPrep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-chlorhexidine';
  if (t === 'iodine') plan = 'iodophor-prep';
  return { plan, t };
}
function Normothermia(input) {
  const i = input || {};
  const c = Number(i.c ?? 36.0);
  let plan = 'normothermic';
  if (c < 36) plan = 'hypothermic-rewarm';
  return { plan, c };
}
function Ebl(input) {
  const i = input || {};
  const ml = Number(i.ml ?? 0);
  let plan = 'minimal-EBL';
  if (ml >= 1000) plan = 'massive-EBL-protocol';
  else if (ml >= 250) plan = 'significant-EBL';
  return { plan, ml };
}
module.exports = {
  PreopEval, Npo, Meds, Handoff, SignIn, TimeOut, SignOut, SkinPrep, Normothermia, Ebl
};
