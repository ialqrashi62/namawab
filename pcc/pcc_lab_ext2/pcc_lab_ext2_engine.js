// P3_CI pcc_lab_ext2_engine v3.47.0
'use strict';
function Comprehensive(input) {
  const i = input || {};
  const count = Number(i.count ?? 0);
  let plan = 'basic-panel';
  if (count >= 8) plan = 'multipanel-cmp';
  else if (count >= 4) plan = 'standard-panel';
  return { plan, count };
}
function Toxicology(input) {
  const i = input || {};
  const screen = String(i.screen || '');
  let plan = 'standard-tox';
  if (screen === 'drug') plan = 'drugs-of-abuse';
  else if (screen === 'alcohol') plan = 'alcohol-level';
  else if (screen === 'heavy') plan = 'heavy-metal-screen';
  return { plan, screen };
}
function Molecular(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-molecular';
  if (t === 'PCR') plan = 'molecular-PCR';
  else if (t === 'culture') plan = 'culture-id';
  return { plan, t };
}
function Banked(input) {
  const i = input || {};
  const days = Number(i.days ?? 0);
  let plan = 'no-storage';
  if (days >= 30) plan = 'short-storage';
  else if (days >= 7) plan = 'short-term-storage';
  return { plan, days };
}
function Convenience(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-collection';
  if (t === 'drug-level') plan = 'trough-level';
  return { plan, t };
}
function Reference(input) {
  const i = input || {};
  const lab = String(i.lab || '');
  let plan = 'in-house';
  if (lab === 'external') plan = 'send-out';
  return { plan, lab };
}
function PointOfCare(input) {
  const i = input || {};
  const place = String(i.place || '');
  let plan = 'central-lab';
  if (place === 'bedside') plan = 'bedside-glucose';
  return { plan, place };
}
function Quality(input) {
  const i = input || {};
  const cv = Number(i.cv ?? 0);
  let plan = 'acceptable';
  if (cv < 0.1) plan = 'high-precision';
  else if (cv >= 0.2) plan = 'low-precision';
  return { plan, cv };
}
function Turnaround(input) {
  const i = input || {};
  const hr = Number(i.hr ?? 24);
  let plan = 'routine-TAT';
  if (hr <= 1) plan = 'stat-TAT';
  else if (hr <= 4) plan = 'urgent-TAT';
  return { plan, hr };
}
function Critical(input) {
  const i = input || {};
  const val = String(i.val || '');
  let plan = 'no-critical';
  if (val.startsWith('K-')) plan = 'panic-value-call';
  return { plan, val };
}
module.exports = {
  Comprehensive, Toxicology, Molecular, Banked, Convenience, Reference, PointOfCare, Quality, Turnaround, Critical
};
