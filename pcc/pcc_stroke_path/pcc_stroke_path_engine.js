// P3-CS pcc_stroke_path_engine v3.57.0
'use strict';
function Nihss(input) {
  const i = input || {};
  const s = Number(i.s ?? 0);
  let plan = 'no-stroke';
  if (s >= 21) plan = 'very-severe-stroke';
  else if (s >= 16) plan = 'severe-stroke';
  else if (s >= 6) plan = 'moderate-stroke';
  return { plan, s };
}
function Imaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-imaging';
  if (t === 'CT') plan = 'CT-stat';
  return { plan, t };
}
function Tpa(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-tPA';
  if (t === 'eligible') plan = 'tPA-eligible';
  return { plan, t };
}
function Thrombectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-thrombectomy';
  if (t === 'LVO') plan = 'LVO-thrombectomy';
  return { plan, t };
}
function Consent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-consent';
  if (t === 'obtained') plan = 'consent-obtained';
  return { plan, t };
}
function BpTarget(input) {
  const i = input || {};
  const sbp = Number(i.sbp ?? 150);
  let plan = 'normal-BP';
  if (sbp >= 185) plan = 'BP-allowed-elevated';
  return { plan, sbp };
}
function NihssFollowup(input) {
  const i = input || {};
  const s = Number(i.s ?? 0);
  let plan = 'no-followup';
  if (s <= 4) plan = 'improved-NIHSS';
  return { plan, s };
}
function Hemorrhage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ICH';
  if (t === 'symptomatic') plan = 'symptomatic-ICH';
  return { plan, t };
}
function Swallow(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'passed-swallow';
  if (t === 'failed') plan = 'failed-swallow-screen';
  return { plan, t };
}
function Transfer(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-transfer';
  if (t === 'ICU') plan = 'ICU-transfer';
  return { plan, t };
}
module.exports = {
  Nihss, Imaging, Tpa, Thrombectomy, Consent, BpTarget, NihssFollowup, Hemorrhage, Swallow, Transfer
};
