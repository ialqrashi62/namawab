// P3_EJ pcc_pediatric_derm_ext_engine v3.100.0
'use strict';
function PediatricEczema(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEczema-none';
  if (t === 'yes') plan = 'pediatricEczema-protocol';
  return { plan, t };
}
function PediatricPsoriasis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPsoriasis-none';
  if (t === 'yes') plan = 'pediatricPsoriasis-protocol';
  return { plan, t };
}
function PediatricAcne(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAcne-none';
  if (t === 'yes') plan = 'pediatricAcne-protocol';
  return { plan, t };
}
function PediatricHemangioma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHemangioma-none';
  if (t === 'yes') plan = 'pediatricHemangioma-protocol';
  return { plan, t };
}
function PediatricMolluscum(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMolluscum-none';
  if (t === 'yes') plan = 'pediatricMolluscum-protocol';
  return { plan, t };
}
function PediatricWarts(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricWarts-none';
  if (t === 'yes') plan = 'pediatricWarts-protocol';
  return { plan, t };
}
function PediatricBirthmarks(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBirthmarks-none';
  if (t === 'yes') plan = 'pediatricBirthmarks-protocol';
  return { plan, t };
}
function PediatricDrugRash(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDrugRash-none';
  if (t === 'yes') plan = 'pediatricDrugRash-protocol';
  return { plan, t };
}
function PediatricHairDisorders(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHairDisorders-none';
  if (t === 'yes') plan = 'pediatricHairDisorders-protocol';
  return { plan, t };
}
function PediatricNailDisorders(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNailDisorders-none';
  if (t === 'yes') plan = 'pediatricNailDisorders-protocol';
  return { plan, t };
}
module.exports = { PediatricEczema, PediatricPsoriasis, PediatricAcne, PediatricHemangioma, PediatricMolluscum, PediatricWarts, PediatricBirthmarks, PediatricDrugRash, PediatricHairDisorders, PediatricNailDisorders };
