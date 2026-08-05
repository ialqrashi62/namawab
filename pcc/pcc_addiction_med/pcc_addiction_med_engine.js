// P3_CX pcc_addiction_med_engine v3.62.0
'use strict';
function Audit(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'audit-none';
  if (t === 'yes') plan = 'audit-protocol';
  return { plan, t };
}
function Dast(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dast-none';
  if (t === 'yes') plan = 'dast-protocol';
  return { plan, t };
}
function Cage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cage-none';
  if (t === 'yes') plan = 'cage-protocol';
  return { plan, t };
}
function Motivation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'motivation-none';
  if (t === 'yes') plan = 'motivation-protocol';
  return { plan, t };
}
function Withdrawal(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'withdrawal-none';
  if (t === 'yes') plan = 'withdrawal-protocol';
  return { plan, t };
}
function MatOpioid(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'matopioid-none';
  if (t === 'yes') plan = 'matopioid-protocol';
  return { plan, t };
}
function MatAlcohol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'matalcohol-none';
  if (t === 'yes') plan = 'matalcohol-protocol';
  return { plan, t };
}
function Overdose(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'overdose-none';
  if (t === 'yes') plan = 'overdose-protocol';
  return { plan, t };
}
function HarmReduction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'harmreduction-none';
  if (t === 'yes') plan = 'harmreduction-protocol';
  return { plan, t };
}
function RelapsePlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'relapseplan-none';
  if (t === 'yes') plan = 'relapseplan-protocol';
  return { plan, t };
}
module.exports = {
  Audit, Dast, Cage, Motivation, Withdrawal, MatOpioid, MatAlcohol, Overdose, HarmReduction, RelapsePlan
};
