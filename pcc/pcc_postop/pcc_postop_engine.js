// P3_CH pcc_postop_engine v3.46.0
'use strict';
function Pacu(input) {
  const i = input || {};
  const ald = Number(i.ald ?? 9);
  let plan = 'phase-1-PACU';
  if (ald <= 8) plan = 'PACU-discharge-ready';
  return { plan, ald };
}
function Pain(input) {
  const i = input || {};
  const n = Number(i.n ?? 0);
  let plan = 'no-pain';
  if (n >= 7) plan = 'severe-pain-multimodal';
  else if (n >= 4) plan = 'moderate-pain-PCA';
  else if (n >= 1) plan = 'mild-pain-oral';
  return { plan, n };
}
function Nausea(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'no-ponv';
  if (s === 'moderate') plan = 'multi-antiemetic';
  else if (s === 'severe') plan = 'severe-ponv-protocol';
  return { plan, s };
}
function Diet(input) {
  const i = input || {};
  const d = String(i.d || '');
  let plan = 'NPO';
  if (d === 'clear') plan = 'clear-liquids';
  else if (d === 'regular') plan = 'regular-diet';
  return { plan, d };
}
function Activity(input) {
  const i = input || {};
  const a = String(i.a || '');
  let plan = 'bedrest';
  if (a === 'ambulate') plan = 'ambulate-today';
  else if (a === 'up-to-chair') plan = 'up-to-chair';
  return { plan, a };
}
function Dvt(input) {
  const i = input || {};
  const r = String(i.r || '');
  let plan = 'no-prophylaxis';
  if (r === 'high') plan = 'extended-LMWH';
  return { plan, r };
}
function Wound(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'clean-dry-intact';
  if (s === 'red') plan = 'erythema-watchful-wait';
  else if (s === 'dehiscence') plan = 'wound-dehiscence-OR';
  return { plan, s };
}
function Drain(input) {
  const i = input || {};
  const ml = Number(i.ml ?? 0);
  let plan = 'no-drain';
  if (ml >= 100) plan = 'high-output-drain';
  return { plan, ml };
}
function Discharge(input) {
  const i = input || {};
  const d = Number(i.d ?? 0);
  let plan = 'observation';
  if (d >= 1) plan = 'discharge-today';
  return { plan, d };
}
function FollowUp(input) {
  const i = input || {};
  const days = Number(i.days ?? 0);
  let plan = 'no-followup';
  if (days <= 7) plan = '1-week-followup';
  else if (days <= 14) plan = '2-week-followup';
  else if (days <= 30) plan = '1-month-followup';
  return { plan, days };
}
module.exports = {
  Pacu, Pain, Nausea, Diet, Activity, Dvt, Wound, Drain, Discharge, FollowUp
};
