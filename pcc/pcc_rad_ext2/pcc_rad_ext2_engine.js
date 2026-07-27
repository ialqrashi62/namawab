// P3-CI pcc_rad_ext2_engine v3.47.0
'use strict';
function Modality(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-XR';
  if (t === 'MRI') plan = 'MRI-scan';
  else if (t === 'CT') plan = 'CT-scan';
  else if (t === 'US') plan = 'ultrasound';
  return { plan, t };
}
function BodyPart(input) {
  const i = input || {};
  const part = String(i.p || '');
  let plan = 'general-protocol';
  if (part === 'head') plan = 'head-protocol';
  else if (part === 'chest') plan = 'chest-protocol';
  return { plan, part };
}
function Indication(input) {
  const i = input || {};
  const ind = String(i.i || '');
  let plan = 'general-indication';
  if (ind === 'trauma') plan = 'trauma-protocol';
  else if (ind === 'stroke') plan = 'stroke-protocol';
  return { plan, ind };
}
function Contrast(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'no-contrast';
  if (c === 'IV') plan = 'IV-contrast';
  return { plan, c };
}
function Urgency(input) {
  const i = input || {};
  const u = String(i.u || '');
  let plan = 'routine';
  if (u === 'urgent') plan = 'urgent-protocol';
  else if (u === 'stat') plan = 'stat-protocol';
  return { plan, u };
}
function Comparison(input) {
  const i = input || {};
  const c = String(i.c || '');
  let plan = 'no-comparison';
  if (c === 'available') plan = 'compare-prior';
  return { plan, c };
}
function Dose(input) {
  const i = input || {};
  const ctdi = Number(i.ctdi ?? 0);
  let plan = 'standard-dose';
  if (ctdi >= 30) plan = 'high-dose';
  else if (ctdi >= 15) plan = 'moderate-dose';
  return { plan, ctdi };
}
function Pregnancy(input) {
  const i = input || {};
  const p = String(i.p || '');
  let plan = 'not-applicable';
  if (p === 'yes') plan = 'pregnancy-positive';
  return { plan, p };
}
function Pediatric(input) {
  const i = input || {};
  const y = Number(i.y ?? 0);
  let plan = 'adult-protocol';
  if (y < 12) plan = 'pediatric-protocol';
  return { plan, y };
}
function Report(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-report';
  if (t === 'critical') plan = 'critical-result-call';
  return { plan, t };
}
module.exports = {
  Modality, BodyPart, Indication, Contrast, Urgency, Comparison, Dose, Pregnancy, Pediatric, Report
};
