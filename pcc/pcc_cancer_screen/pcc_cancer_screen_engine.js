// P3-CU pcc_cancer_screen_engine v3.59.0
'use strict';
function Breast(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-mammo';
  if (t === 'overdue') plan = 'mammo-overdue';
  else if (t === 'normal') plan = 'mammo-normal';
  return { plan, t };
}
function Colon(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-colon';
  if (t === 'overdue') plan = 'colon-overdue';
  return { plan, t };
}
function Cervix(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-pap';
  if (t === 'overdue') plan = 'pap-overdue';
  return { plan, t };
}
function Prostate(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-psa';
  if (t === 'elevated') plan = 'elevated-PSA';
  return { plan, t };
}
function Lung(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-lung-screening';
  if (t === 'eligible') plan = 'LDCT-eligible';
  return { plan, t };
}
function Skin(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-skin-screening';
  if (t === 'suspicious') plan = 'suspicious-skin';
  return { plan, t };
}
function Ovarian(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ov-screening';
  if (t === 'high-risk') plan = 'high-risk-ovarian';
  return { plan, t };
}
function Hpv(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hpv';
  if (t === 'positive') plan = 'HPV-positive';
  return { plan, t };
}
function Smear(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-smear';
  if (t === 'abnormal') plan = 'abnormal-smear';
  return { plan, t };
}
function Recall(input) {
  const i = input || {};
  const d = Number(i.d ?? 0);
  let plan = 'no-recall';
  if (d <= 30) plan = 'recall-soon';
  return { plan, d };
}
module.exports = {
  Breast, Colon, Cervix, Prostate, Lung, Skin, Ovarian, Hpv, Smear, Recall
};
