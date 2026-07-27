// P3-CV pcc_sports_med_engine v3.60.0
'use strict';
function Injury(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-injury';
  if (t === 'acl') plan = 'acl-evaluation';
  else if (t === 'concussion') plan = 'concussion-protocol';
  return { plan, t };
}
function ReturnToPlay(input) {
  const i = input || {};
  const s = Number(i.s ?? 100);
  let plan = 'rtp-cleared';
  if (s < 80) plan = 'rtp-pending';
  return { plan, s };
}
function Concussion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-concussion';
  if (t === 'grade1') plan = 'concussion-grade1';
  else if (t === 'grade2') plan = 'concussion-grade2';
  return { plan, t };
}
function CardiacScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cardiac-normal';
  if (t === 'risk') plan = 'cardiac-risk-refer';
  return { plan, t };
}
function Hydration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hydration-ok';
  if (t === 'low') plan = 'hydration-protocol';
  return { plan, t };
}
function Heat(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-heat-illness';
  if (t === 'exhaustion') plan = 'heat-exhaustion-protocol';
  return { plan, t };
}
function Overuse(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-overuse';
  if (t === 'stress') plan = 'stress-injury-rest';
  return { plan, t };
}
function Doping(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-doping';
  if (t === 'suspected') plan = 'anti-doping-referral';
  return { plan, t };
}
function Nutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutrition-ok';
  if (t === 'deficit') plan = 'sports-nutrition-plan';
  return { plan, t };
}
function Imaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'imaging-none';
  if (t === 'mri') plan = 'mri-indicated';
  return { plan, t };
}
module.exports = {
  Injury, ReturnToPlay, Concussion, CardiacScreen, Hydration, Heat, Overuse, Doping, Nutrition, Imaging
};
