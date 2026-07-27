// P3-CL pcc_derma_ext3_engine v3.50.0
'use strict';
function Lesion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-lesion';
  if (t === 'benign') plan = 'benign-lesion';
  else if (t === 'suspicious') plan = 'suspicious-biopsy';
  return { plan, t };
}
function Rash(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-rash';
  if (t === 'urticaria') plan = 'urticaria-treatment';
  else if (t === 'eczema') plan = 'eczema-management';
  return { plan, t };
}
function Burn(input) {
  const i = input || {};
  const tbsa = Number(i.tbsa ?? 0);
  let plan = 'minor-burn';
  if (tbsa >= 20) plan = 'major-burn-center';
  else if (tbsa >= 10) plan = 'moderate-burn';
  return { plan, tbsa };
}
function Melanoma(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'no-melanoma';
  if (s === 'T1') plan = 'melanoma-T1';
  else if (s === 'T4') plan = 'melanoma-T4';
  return { plan, s };
}
function Psoriasis(input) {
  const i = input || {};
  const s = Number(i.s ?? 0);
  let plan = 'mild-psoriasis';
  if (s >= 20) plan = 'severe-psoriasis';
  else if (s >= 10) plan = 'moderate-psoriasis';
  return { plan, s };
}
function Acne(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'mild-acne';
  if (s === 'severe') plan = 'severe-acne-isotretinoin';
  return { plan, s };
}
function Ulcer(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ulcer';
  if (t === 'venous') plan = 'venous-stasis-ulcer';
  else if (t === 'arterial') plan = 'arterial-ulcer';
  return { plan, t };
}
function Mohs(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-Mohs';
  if (t === 'yes') plan = 'Mohs-surgery';
  return { plan, t };
}
function Dermoscopy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-dermoscopy';
  if (t === 'malignant') plan = 'suspicious-dermoscopy';
  return { plan, t };
}
function Patch(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-patch-test';
  if (t === 'positive') plan = 'positive-allergen';
  return { plan, t };
}
module.exports = {
  Lesion, Rash, Burn, Melanoma, Psoriasis, Acne, Ulcer, Mohs, Dermoscopy, Patch
};
