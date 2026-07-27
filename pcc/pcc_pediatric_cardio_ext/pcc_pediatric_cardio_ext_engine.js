// P3-EO pcc_pediatric_cardio_ext_engine v3.105.0
'use strict';
function PediatricCHF(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCHF-none';
  if (t === 'yes') plan = 'pediatricCHF-protocol';
  return { plan, t };
}
function PediatricArrhythmiaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricArrhythmiaEval-none';
  if (t === 'yes') plan = 'pediatricArrhythmiaEval-protocol';
  return { plan, t };
}
function PediatricHypertensionEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHypertensionEval-none';
  if (t === 'yes') plan = 'pediatricHypertensionEval-protocol';
  return { plan, t };
}
function PediatricLipidDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLipidDisorder-none';
  if (t === 'yes') plan = 'pediatricLipidDisorder-protocol';
  return { plan, t };
}
function PediatricKawasakiLongTerm(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricKawasakiLongTerm-none';
  if (t === 'yes') plan = 'pediatricKawasakiLongTerm-protocol';
  return { plan, t };
}
function PediatricCardiomyopathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCardiomyopathy-none';
  if (t === 'yes') plan = 'pediatricCardiomyopathy-protocol';
  return { plan, t };
}
function PediatricHeartTransplant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHeartTransplant-none';
  if (t === 'yes') plan = 'pediatricHeartTransplant-protocol';
  return { plan, t };
}
function PediatricFontan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricFontan-none';
  if (t === 'yes') plan = 'pediatricFontan-protocol';
  return { plan, t };
}
function PediatricTetralogy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTetralogy-none';
  if (t === 'yes') plan = 'pediatricTetralogy-protocol';
  return { plan, t };
}
function PediatricVSD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricVSD-none';
  if (t === 'yes') plan = 'pediatricVSD-protocol';
  return { plan, t };
}
module.exports = { PediatricCHF, PediatricArrhythmiaEval, PediatricHypertensionEval, PediatricLipidDisorder, PediatricKawasakiLongTerm, PediatricCardiomyopathy, PediatricHeartTransplant, PediatricFontan, PediatricTetralogy, PediatricVSD };
