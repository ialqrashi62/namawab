// P3_ET pcc_pediatric_endo_ext2_engine v3.110.0
'use strict';
function PediatricPCOSEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPCOSEval-none';
  if (t === 'yes') plan = 'pediatricPCOSEval-protocol';
  return { plan, t };
}
function PediatricHirsutismEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHirsutismEval-none';
  if (t === 'yes') plan = 'pediatricHirsutismEval-protocol';
  return { plan, t };
}
function PediatricPrecociousPuberty(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPrecociousPuberty-none';
  if (t === 'yes') plan = 'pediatricPrecociousPuberty-protocol';
  return { plan, t };
}
function PediatricDelayedPubertyExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDelayedPubertyExt-none';
  if (t === 'yes') plan = 'pediatricDelayedPubertyExt-protocol';
  return { plan, t };
}
function PediatricGenderIdentityEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGenderIdentityEval-none';
  if (t === 'yes') plan = 'pediatricGenderIdentityEval-protocol';
  return { plan, t };
}
function PediatricAdrenalTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAdrenalTumor-none';
  if (t === 'yes') plan = 'pediatricAdrenalTumor-protocol';
  return { plan, t };
}
function PediatricPituitaryTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPituitaryTumor-none';
  if (t === 'yes') plan = 'pediatricPituitaryTumor-protocol';
  return { plan, t };
}
function PediatricThyroidNodule(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricThyroidNodule-none';
  if (t === 'yes') plan = 'pediatricThyroidNodule-protocol';
  return { plan, t };
}
function PediatricParathyroidEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricParathyroidEval-none';
  if (t === 'yes') plan = 'pediatricParathyroidEval-protocol';
  return { plan, t };
}
function PediatricBoneHealthEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBoneHealthEval-none';
  if (t === 'yes') plan = 'pediatricBoneHealthEval-protocol';
  return { plan, t };
}
module.exports = { PediatricPCOSEval, PediatricHirsutismEval, PediatricPrecociousPuberty, PediatricDelayedPubertyExt, PediatricGenderIdentityEval, PediatricAdrenalTumor, PediatricPituitaryTumor, PediatricThyroidNodule, PediatricParathyroidEval, PediatricBoneHealthEval };
