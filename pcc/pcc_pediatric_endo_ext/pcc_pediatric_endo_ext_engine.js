// P3_EP pcc_pediatric_endo_ext_engine v3.106.0
'use strict';
function PediatricType2Diabetes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricType2Diabetes-none';
  if (t === 'yes') plan = 'pediatricType2Diabetes-protocol';
  return { plan, t };
}
function PediatricMODY(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMODY-none';
  if (t === 'yes') plan = 'pediatricMODY-protocol';
  return { plan, t };
}
function PediatricNeonatalDiabetes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNeonatalDiabetes-none';
  if (t === 'yes') plan = 'pediatricNeonatalDiabetes-protocol';
  return { plan, t };
}
function PediatricHypothyroidism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHypothyroidism-none';
  if (t === 'yes') plan = 'pediatricHypothyroidism-protocol';
  return { plan, t };
}
function PediatricHyperthyroidism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHyperthyroidism-none';
  if (t === 'yes') plan = 'pediatricHyperthyroidism-protocol';
  return { plan, t };
}
function PediatricThyroidCancer(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricThyroidCancer-none';
  if (t === 'yes') plan = 'pediatricThyroidCancer-protocol';
  return { plan, t };
}
function PediatricAdrenalInsufficiency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAdrenalInsufficiency-none';
  if (t === 'yes') plan = 'pediatricAdrenalInsufficiency-protocol';
  return { plan, t };
}
function PediatricCushingSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCushingSyndrome-none';
  if (t === 'yes') plan = 'pediatricCushingSyndrome-protocol';
  return { plan, t };
}
function PediatricHypogonadism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHypogonadism-none';
  if (t === 'yes') plan = 'pediatricHypogonadism-protocol';
  return { plan, t };
}
function PediatricDelayedPuberty(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDelayedPuberty-none';
  if (t === 'yes') plan = 'pediatricDelayedPuberty-protocol';
  return { plan, t };
}
module.exports = { PediatricType2Diabetes, PediatricMODY, PediatricNeonatalDiabetes, PediatricHypothyroidism, PediatricHyperthyroidism, PediatricThyroidCancer, PediatricAdrenalInsufficiency, PediatricCushingSyndrome, PediatricHypogonadism, PediatricDelayedPuberty };
