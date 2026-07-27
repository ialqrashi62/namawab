// P3-CG pcc_dialysis_engine v3.45.0
'use strict';
function Access(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'no-access';
  if (type === 'AVF') plan = 'AV-fistula-preferred';
  else if (type === 'AVG') plan = 'AV-graft';
  else if (type === 'catheter') plan = 'tunneled-catheter';
  return { plan, type };
}
function Treatment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-hd';
  if (t === 'HD') plan = 'in-center-hemodialysis';
  else if (t === 'PD') plan = 'peritoneal-dialysis';
  else if (t === 'HDF') plan = 'hemodiafiltration';
  return { plan, t };
}
function Clearance(input) {
  const i = input || {};
  const ktv = Number(i.ktv ?? 0);
  let plan = 'suboptimal';
  if (ktv >= 1.4) plan = 'adequate-clearance';
  else if (ktv >= 1.2) plan = 'minimum-acceptable';
  return { plan, ktv };
}
function DryWeight(input) {
  const i = input || {};
  const over = Number(i.over ?? 0);
  let plan = 'at-dry-weight';
  if (over > 3) plan = 'above-dry-weight';
  else if (over < -1) plan = 'below-dry-weight';
  return { plan, over };
}
function Ultrafiltration(input) {
  const i = input || {};
  const rate = Number(i.rate ?? 0);
  let plan = 'standard-uf';
  if (rate > 13) plan = 'excessive-uf-risk';
  else if (rate > 10) plan = 'high-uf-caution';
  return { plan, rate };
}
function Heparin(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-heparin';
  if (t === 'bolus') plan = 'heparin-bolus';
  else if (t === 'infusion') plan = 'heparin-infusion';
  else if (t === 'low') plan = 'low-dose-heparin';
  return { plan, t };
}
function Sodium(input) {
  const i = input || {};
  const conc = Number(i.conc ?? 0);
  let plan = 'standard-sodium';
  if (conc >= 140) plan = 'high-sodium-dialysate';
  else if (conc <= 130) plan = 'low-sodium-dialysate';
  return { plan, conc };
}
function Bicarbonate(input) {
  const i = input || {};
  const level = Number(i.level ?? 35);
  let plan = 'standard-bicarb';
  if (level >= 38) plan = 'high-bicarb';
  else if (level <= 30) plan = 'low-bicarb';
  return { plan, level };
}
function Reuse(input) {
  const i = input || {};
  const cnt = Number(i.cnt ?? 0);
  let plan = 'no-reuse';
  if (cnt >= 1) plan = 'dialyzer-reuse';
  if (cnt >= 15) plan = 'reuse-limit';
  return { plan, cnt };
}
function KtV(input) {
  const i = input || {};
  const v = Number(i.v ?? 0);
  let plan = 'inadequate';
  if (v >= 1.2) plan = 'adequate-Kt-V';
  return { plan, v };
}
module.exports = {
  Access, Treatment, Clearance, DryWeight, Ultrafiltration, Heparin, Sodium, Bicarbonate, Reuse, KtV
};
